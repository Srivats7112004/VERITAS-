import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict


DB_PATH = Path(__file__).resolve().parent / "data" / "veritas.db"


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def get_connection():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def add_column_if_missing(conn, table_name: str, column_name: str, column_definition: str):
    columns = conn.execute(f"PRAGMA table_info({table_name})").fetchall()
    existing_columns = [column["name"] for column in columns]

    if column_name not in existing_columns:
        conn.execute(
            f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_definition}"
        )


def init_db():
    with get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS analysis_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                followers INTEGER NOT NULL,
                following INTEGER NOT NULL,
                bio TEXT DEFAULT '',
                message TEXT NOT NULL,
                risk_score REAL NOT NULL,
                category TEXT NOT NULL,
                scam_type TEXT DEFAULT 'unknown',
                confidence TEXT DEFAULT 'Low',
                risk_factors_json TEXT DEFAULT '[]',
                score_breakdown_json TEXT DEFAULT '[]',
                url_analysis_json TEXT DEFAULT '{}',
                created_at TEXT NOT NULL
            )
            """
        )

        add_column_if_missing(
            conn,
            "analysis_logs",
            "url_analysis_json",
            "TEXT DEFAULT '{}'",
        )

        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS simulation_attempts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                scenario_id INTEGER NOT NULL,
                scenario_title TEXT NOT NULL,
                user_response TEXT NOT NULL,
                correct_response TEXT NOT NULL,
                is_correct INTEGER NOT NULL,
                tactics_json TEXT DEFAULT '[]',
                created_at TEXT NOT NULL
            )
            """
        )

        conn.commit()


def save_analysis(request_data: Dict, result: Dict) -> int:
    with get_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO analysis_logs (
                username, followers, following, bio, message,
                risk_score, category, scam_type, confidence,
                risk_factors_json, score_breakdown_json, url_analysis_json, created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                request_data.get("username", ""),
                int(request_data.get("followers", 0)),
                int(request_data.get("following", 0)),
                request_data.get("bio", "") or "",
                request_data.get("message", "") or "",
                float(result.get("risk_score", 0)),
                result.get("category", "Low"),
                result.get("scam_type", "unknown"),
                result.get("confidence", "Low"),
                json.dumps(result.get("risk_factors", [])),
                json.dumps(result.get("score_breakdown", [])),
                json.dumps(result.get("url_analysis", {})),
                now_iso(),
            ),
        )
        conn.commit()
        return int(cursor.lastrowid)


def save_simulation_attempt(scenario: Dict, user_response: str, is_correct: bool) -> int:
    with get_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO simulation_attempts (
                scenario_id, scenario_title, user_response,
                correct_response, is_correct, tactics_json, created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                int(scenario["id"]),
                scenario["title"],
                user_response,
                scenario["correct_response"],
                1 if is_correct else 0,
                json.dumps(scenario.get("manipulation_tactics", [])),
                now_iso(),
            ),
        )
        conn.commit()
        return int(cursor.lastrowid)


def get_dashboard_stats() -> Dict:
    init_db()

    with get_connection() as conn:
        total = conn.execute(
            "SELECT COUNT(*) AS count FROM analysis_logs"
        ).fetchone()["count"]

        high = conn.execute(
            "SELECT COUNT(*) AS count FROM analysis_logs WHERE category = 'High'"
        ).fetchone()["count"]

        active_users = conn.execute(
            "SELECT COUNT(DISTINCT username) AS count FROM analysis_logs"
        ).fetchone()["count"]

        risk_rows = conn.execute(
            """
            SELECT category, COUNT(*) AS count
            FROM analysis_logs
            GROUP BY category
            """
        ).fetchall()

        trend_rows = conn.execute(
            """
            SELECT substr(created_at, 1, 10) AS day, COUNT(*) AS detections
            FROM analysis_logs
            GROUP BY day
            ORDER BY day ASC
            LIMIT 7
            """
        ).fetchall()

        scam_rows = conn.execute(
            """
            SELECT scam_type, COUNT(*) AS count
            FROM analysis_logs
            WHERE scam_type IS NOT NULL
            AND scam_type != ''
            AND scam_type != 'unknown'
            GROUP BY scam_type
            ORDER BY count DESC
            LIMIT 5
            """
        ).fetchall()

        recent_rows = conn.execute(
            """
            SELECT id, username, risk_score, category, scam_type, confidence, created_at
            FROM analysis_logs
            ORDER BY id DESC
            LIMIT 8
            """
        ).fetchall()

        url_rows = conn.execute(
            """
            SELECT url_analysis_json
            FROM analysis_logs
            """
        ).fetchall()

        sim_total = conn.execute(
            "SELECT COUNT(*) AS count FROM simulation_attempts"
        ).fetchone()["count"]

        sim_correct = conn.execute(
            "SELECT COUNT(*) AS count FROM simulation_attempts WHERE is_correct = 1"
        ).fetchone()["count"]

    suspicious_url_count = 0
    total_urls_found = 0

    for row in url_rows:
        try:
            data = json.loads(row["url_analysis_json"] or "{}")
            suspicious_url_count += int(data.get("suspicious_urls", 0))
            total_urls_found += int(data.get("urls_found", 0))
        except Exception:
            continue

    risk_counts = {"Low": 0, "Medium": 0, "High": 0}
    for row in risk_rows:
        risk_counts[row["category"]] = int(row["count"])

    simulation_accuracy = round((sim_correct / sim_total) * 100) if sim_total else 0

    return {
        "total_analyses": int(total),
        "high_risk_detected": int(high),
        "scam_keywords_tracked": 40,
        "active_users": int(active_users),
        "total_urls_found": int(total_urls_found),
        "suspicious_urls_detected": int(suspicious_url_count),

        "risk_distribution": [
            {"name": "Low", "value": risk_counts["Low"], "fill": "#10b981"},
            {"name": "Medium", "value": risk_counts["Medium"], "fill": "#f59e0b"},
            {"name": "High", "value": risk_counts["High"], "fill": "#ef4444"},
        ],

        "scam_trends": [
            {"month": row["day"], "detections": int(row["detections"])}
            for row in trend_rows
        ],

        "top_scam_types": [
            {
                "name": str(row["scam_type"]).replace("_", " ").title(),
                "count": int(row["count"]),
            }
            for row in scam_rows
        ],

        "recent_analyses": [dict(row) for row in recent_rows],

        "simulation_accuracy": {
            "attempts": int(sim_total),
            "correct": int(sim_correct),
            "accuracy": simulation_accuracy,
        },
    }


def get_deception_graph() -> Dict:
    init_db()

    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT id, username, category, scam_type, risk_factors_json, url_analysis_json
            FROM analysis_logs
            ORDER BY id DESC
            LIMIT 25
            """
        ).fetchall()

    if not rows:
        return {
            "nodes": [
                {
                    "id": 1,
                    "label": "No analyses yet",
                    "type": "status",
                    "severity": "low",
                }
            ],
            "edges": [],
        }

    nodes = []
    edges = []
    node_lookup = {}
    next_id = 1

    def add_node(label: str, node_type: str, severity: str):
        nonlocal next_id

        key = f"{node_type}:{label}"
        if key in node_lookup:
            return node_lookup[key]

        node_id = next_id
        next_id += 1

        node_lookup[key] = node_id
        nodes.append(
            {
                "id": node_id,
                "label": label,
                "type": node_type,
                "severity": severity,
            }
        )
        return node_id

    for row in rows:
        severity = str(row["category"]).lower()
        username = row["username"] or "Unknown account"
        scam_type = row["scam_type"] or "unknown"

        account_node = add_node(username, "identity", severity)

        if scam_type and scam_type != "unknown":
            scam_node = add_node(
                scam_type.replace("_", " ").title(),
                "scheme",
                severity,
            )
            edges.append({"from": account_node, "to": scam_node})

        try:
            factors = json.loads(row["risk_factors_json"] or "[]")
        except json.JSONDecodeError:
            factors = []

        for factor in factors[:3]:
            factor_node = add_node(str(factor)[:40], "tactic", severity)
            edges.append({"from": account_node, "to": factor_node})

        try:
            url_data = json.loads(row["url_analysis_json"] or "{}")
            findings = url_data.get("findings", [])
        except Exception:
            findings = []

        for finding in findings[:2]:
            domain = finding.get("domain", "unknown domain")
            url_severity = str(finding.get("severity", severity)).lower()
            domain_node = add_node(domain, "url", url_severity)
            edges.append({"from": account_node, "to": domain_node})

    return {
        "nodes": nodes,
        "edges": edges,
    }