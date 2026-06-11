import re
from urllib.parse import urlparse
from typing import Dict, List


URL_REGEX = re.compile(
    r"(https?://[^\s]+|www\.[^\s]+)",
    re.IGNORECASE,
)


SHORTENER_DOMAINS = {
    "bit.ly",
    "tinyurl.com",
    "t.co",
    "goo.gl",
    "rebrand.ly",
    "cutt.ly",
    "shorturl.at",
    "is.gd",
    "ow.ly",
    "s.id",
    "lnkd.in",
}


SUSPICIOUS_TLDS = {
    ".xyz",
    ".top",
    ".click",
    ".buzz",
    ".tk",
    ".ml",
    ".ga",
    ".cf",
    ".gq",
    ".work",
    ".support",
    ".live",
    ".monster",
    ".quest",
    ".icu",
    ".zip",
    ".mov",
}


RISKY_URL_KEYWORDS = {
    "login",
    "verify",
    "verification",
    "secure",
    "security",
    "support",
    "account",
    "password",
    "otp",
    "recover",
    "wallet",
    "reward",
    "claim",
    "bonus",
    "crypto",
    "payment",
    "airdrop",
    "gift",
    "unlock",
    "suspend",
    "appeal",
}


BRAND_OFFICIAL_DOMAINS = {
    "instagram": ["instagram.com"],
    "facebook": ["facebook.com"],
    "meta": ["meta.com", "facebook.com"],
    "paypal": ["paypal.com"],
    "google": ["google.com"],
    "apple": ["apple.com"],
    "binance": ["binance.com"],
    "amazon": ["amazon.com"],
    "microsoft": ["microsoft.com", "live.com", "office.com"],
    "netflix": ["netflix.com"],
    "whatsapp": ["whatsapp.com"],
    "telegram": ["telegram.org"],
    "linkedin": ["linkedin.com"],
    "twitter": ["twitter.com", "x.com"],
}


def extract_urls(text: str) -> List[str]:
    if not text:
        return []

    matches = URL_REGEX.findall(text)
    cleaned_urls = []

    for url in matches:
        cleaned = url.strip().rstrip(".,;:!?)\"]}'")
        if cleaned.startswith("www."):
            cleaned = "http://" + cleaned

        if cleaned not in cleaned_urls:
            cleaned_urls.append(cleaned)

    return cleaned_urls


def get_hostname(url: str) -> str:
    try:
        parsed = urlparse(url)
        return parsed.netloc.lower().replace("www.", "")
    except Exception:
        return ""


def is_ip_address(hostname: str) -> bool:
    return bool(re.fullmatch(r"(\d{1,3}\.){3}\d{1,3}", hostname))


def is_official_domain(hostname: str, official_domains: List[str]) -> bool:
    for domain in official_domains:
        if hostname == domain or hostname.endswith("." + domain):
            return True
    return False


def detect_brand_impersonation(hostname: str) -> List[str]:
    indicators = []

    for brand, official_domains in BRAND_OFFICIAL_DOMAINS.items():
        if brand in hostname and not is_official_domain(hostname, official_domains):
            indicators.append(
                f"Possible {brand.title()} brand impersonation domain"
            )

    return indicators


def classify_url_score(score: int) -> str:
    if score >= 60:
        return "High"
    if score >= 30:
        return "Medium"
    return "Low"


def recommendation_for_url(severity: str) -> str:
    if severity == "High":
        return "Do not click this link. Verify through the official app or website only."
    if severity == "Medium":
        return "Open only after verifying the source independently. Avoid entering credentials."
    return "No major URL risk detected, but continue with normal caution."


def scan_single_url(url: str) -> Dict:
    indicators = []
    score = 0

    parsed = urlparse(url)
    hostname = get_hostname(url)
    full_url_lower = url.lower()
    path_and_query = f"{parsed.path} {parsed.query}".lower()

    if not hostname:
        indicators.append("Malformed or unreadable URL")
        score += 30

    if parsed.scheme != "https":
        indicators.append("Non-HTTPS link detected")
        score += 15

    if hostname in SHORTENER_DOMAINS:
        indicators.append("Shortened URL detected")
        score += 25

    if is_ip_address(hostname):
        indicators.append("URL uses raw IP address instead of domain name")
        score += 30

    for tld in SUSPICIOUS_TLDS:
        if hostname.endswith(tld):
            indicators.append(f"Suspicious top-level domain detected: {tld}")
            score += 20
            break

    risky_keyword_hits = [
        keyword for keyword in RISKY_URL_KEYWORDS
        if keyword in full_url_lower
    ]

    if risky_keyword_hits:
        indicators.append(
            "Risky URL keywords detected: " + ", ".join(sorted(set(risky_keyword_hits))[:5])
        )
        score += min(25, len(set(risky_keyword_hits)) * 5)

    if hostname.count("-") >= 2:
        indicators.append("Domain contains multiple hyphens, often seen in fake login pages")
        score += 10

    if re.search(r"\d", hostname) and any(
        brand in hostname for brand in BRAND_OFFICIAL_DOMAINS.keys()
    ):
        indicators.append("Brand-like domain contains numbers, which may indicate spoofing")
        score += 15

    brand_indicators = detect_brand_impersonation(hostname)
    if brand_indicators:
        indicators.extend(brand_indicators)
        score += 30

    if any(word in path_and_query for word in ["token", "password", "otp", "session", "auth"]):
        indicators.append("Sensitive credential-related terms found in URL path/query")
        score += 20

    score = min(score, 100)
    severity = classify_url_score(score)

    if not indicators:
        indicators.append("No strong suspicious URL indicators detected")

    return {
        "url": url,
        "domain": hostname or "unknown",
        "risk_score": score,
        "severity": severity,
        "indicators": indicators,
        "recommendation": recommendation_for_url(severity),
    }


def scan_urls_from_text(*texts: str) -> Dict:
    combined_text = " ".join([text or "" for text in texts])
    urls = extract_urls(combined_text)

    findings = [scan_single_url(url) for url in urls]

    max_score = max([finding["risk_score"] for finding in findings], default=0)
    suspicious_count = len([
        finding for finding in findings
        if finding["severity"] in ["Medium", "High"]
    ])

    return {
        "urls_found": len(urls),
        "suspicious_urls": suspicious_count,
        "max_url_risk_score": max_score,
        "findings": findings,
    }