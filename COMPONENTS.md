# VERITAS Frontend Components Documentation

## 📚 Component Guide

### Core Components

#### CyberGrid
**Location**: `src/components/CyberGrid.jsx`

Fixed background grid effect with cybernetic styling.

```jsx
import CyberGrid from './components/CyberGrid'

// Usage:
<CyberGrid />
```

**Features**:
- Animated grid background
- Cyberpunk aesthetic
- Fixed positioning (behind content)

---

#### Header
**Location**: `src/components/Header.jsx`

Navigation header with logo and responsive menu.

```jsx
import Header from './components/Header'

// Usage:
<Header />
```

**Features**:
- Logo with animation
- Navigation links
- Mobile hamburger menu
- Active route highlighting
- VERITAS branding

**Props**: None (uses React Router hooks)

---

#### NeonButton
**Location**: `src/components/NeonButton.jsx`

Animated button component with multiple variants.

```jsx
import NeonButton from './components/NeonButton'

// Usage:
<NeonButton 
  onClick={handleClick}
  variant="primary"
  size="md"
  fullWidth={false}
>
  Click Me
</NeonButton>
```

**Props**:
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `fullWidth`: boolean
- `disabled`: boolean
- `onClick`: function
- `children`: React.ReactNode

**Variants**:
- **primary**: Cyan to blue gradient (main CTA)
- **secondary**: Purple to blue gradient
- **outline**: Border with hover fill
- **ghost**: Transparent with hover background

---

#### GlassCard
**Location**: `src/components/GlassCard.jsx`

Reusable glassmorphism card component.

```jsx
import GlassCard from './components/GlassCard'

// Usage:
<GlassCard 
  glow={true}
  hover={true}
  delay={0.1}
>
  Content goes here
</GlassCard>
```

**Props**:
- `children`: React.ReactNode
- `className`: string (optional)
- `hover`: boolean (default: true)
- `glow`: boolean (default: false)
- `delay`: number (animation delay in seconds)

**Features**:
- Glassmorphism effect
- Optional neon glow
- Hover elevation
- Fade-in animation

---

#### RiskGauge
**Location**: `src/components/RiskGauge.jsx`

Animated circular gauge for displaying risk scores.

```jsx
import RiskGauge from './components/RiskGauge'

// Usage:
<RiskGauge score={75} category="High" />
```

**Props**:
- `score`: number (0-100)
- `category`: 'Low' | 'Medium' | 'High'

**Features**:
- Animated progress circle
- Color changes based on score
- Smooth transitions
- Explainable categories

---

#### AnimatedCounter
**Location**: `src/components/AnimatedCounter.jsx`

Animated number counter for statistics.

```jsx
import AnimatedCounter from './components/AnimatedCounter'

// Usage:
<AnimatedCounter from={0} to={2847} duration={2} prefix="$" suffix="k" />
```

**Props**:
- `from`: number (starting value)
- `to`: number (ending value)
- `duration`: number (animation duration in seconds)
- `prefix`: string (optional)
- `suffix`: string (optional)

---

### Page Components

#### Landing
**Location**: `src/pages/Landing.jsx`

Hero section with feature highlights and CTA.

**Sections**:
1. Hero with branding
2. Feature grid (6 features)
3. How it works section
4. CTA buttons

**Key Features**:
- Animated title and tagline
- Feature card grid
- Process visualization
- Call-to-action buttons

---

#### RiskAnalyzer
**Location**: `src/pages/RiskAnalyzer.jsx`

Main analysis tool with form and results display.

**Sections**:
1. Input form (left)
2. Results display (right)

**Form Fields**:
- Username (required)
- Followers count (required)
- Following count (required)
- Bio (optional)
- Message (required)

**Results Display**:
- Risk gauge
- Risk factors list
- AI reasoning explanation
- Recommendations

**Features**:
- Real-time validation
- Loading state with animation
- Error handling
- Responsive layout

---

#### TwinDetection
**Location**: `src/pages/TwinDetection.jsx`

Impersonation detection and comparison tool.

**Sections**:
1. Input form (left)
2. Analysis results (right)

**Form Fields**:
- Legitimate username
- Suspicious username

**Results Display**:
- Impersonation detection
- Similarity percentage
- Matching patterns
- Suspicious indicators
- Recommendations

---

#### SimulationLab
**Location**: `src/pages/SimulationLab.jsx`

Interactive training scenarios.

**Sections**:
1. Scenario list (left)
2. Scenario display (right)

**Functionality**:
- Load scenarios from API
- Display scenario content
- Three response options: Trust, Verify, Ignore
- Immediate feedback
- Tactics explanation

**Features**:
- Multiple scenarios
- Instant feedback
- Educational content
- Progress tracking

---

#### DeceptionGraph
**Location**: `src/pages/DeceptionGraph.jsx`

Network visualization of fraud connections.

**Sections**:
1. SVG graph visualization
2. Network legend
3. Node details panel
4. Network statistics

**Features**:
- Interactive node selection
- Animated edges
- Severity-based coloring
- Hover effects
- Pulse animations for high-severity nodes

---

#### Dashboard
**Location**: `src/pages/Dashboard.jsx`

Analytics and statistics dashboard.

**Sections**:
1. KPI cards (4 metrics)
2. Risk distribution chart
3. Detection trends
4. Top scam types
5. Performance stats

**Charts**:
- Pie chart (risk distribution)
- Line chart (trends)
- Bar chart (scam types)
- Progress bars (performance)

**Features**:
- Animated counters
- Interactive charts
- Real-time statistics
- Responsive grid

---

#### Architecture
**Location**: `src/pages/Architecture.jsx`

System architecture and detection factors explanation.

**Sections**:
1. Analysis pipeline (6 steps)
2. Detection factors (4 categories)
3. Scoring algorithm
4. Technology stack

**Features**:
- Step-by-step pipeline visualization
- Factor breakdown grid
- Algorithm explanation
- Technology stack cards

---

## 🎨 Styling System

### Global Styles
**Location**: `src/index.css`

Contains:
- Tailwind directives
- Custom keyframes
- Utility classes
- Scrollbar styling

### Key Classes

**Glassmorphism**:
```css
.glassmorphism
.glassmorphism-deep
```

**Glows**:
```css
.neon-glow
.neon-glow-strong
.neon-glow-purple
```

**Text Effects**:
```css
.text-gradient
.text-gradient-purple
```

**Animations**:
```css
.animate-pulse-cyber
.animate-float
.animate-glow-pulse
```

---

## 🔌 API Integration

### API Client
**Location**: `src/utils/api.js`

Axios instance for API calls.

**Methods**:
- `analyzeIdentity(data)` - POST /api/analyze
- `detectTwin(data)` - POST /api/twin-detection
- `getSimulationScenarios()` - GET /api/simulations
- `submitSimulationResponse(id, response)` - POST /api/simulations/{id}/response
- `getDashboardStats()` - GET /api/dashboard/stats
- `getDeceptionGraph()` - GET /api/deception-graph

**Usage**:
```jsx
import { analyzeIdentity } from '../utils/api'

try {
  const response = await analyzeIdentity({
    username: '@user',
    followers: 100,
    following: 150,
    bio: 'Test bio',
    message: 'Test message'
  })
  console.log(response.data)
} catch (err) {
  console.error('Error:', err)
}
```

---

## 🎯 Common Patterns

### Loading State
```jsx
{loading ? (
  <>
    <motion.div animate={{ rotate: 360 }} ... />
    Loading...
  </>
) : (
  <Content />
)}
```

### Error Handling
```jsx
{error && (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <AlertCircle /> {error}
  </motion.div>
)}
```

### Animations
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.2 }}
>
  Content
</motion.div>
```

---

## 📦 Dependencies

### Key Libraries
- **React 18**: UI framework
- **Framer Motion**: Animations
- **Tailwind CSS**: Styling
- **Recharts**: Charts
- **Lucide React**: Icons
- **Axios**: HTTP client
- **React Router**: Navigation

---

## 🚀 Component Best Practices

1. **Use GlassCard** for content containers
2. **Use NeonButton** for all interactive buttons
3. **Wrap animations** with motion.div
4. **Handle loading states** in components
5. **Show error messages** to users
6. **Use responsive classes** (md:, lg:)
7. **Keep components reusable**
8. **Pass data via props**

---

## 🔄 Data Flow

```
User Input
    ↓
Component State
    ↓
API Call (async)
    ↓
Response Processing
    ↓
State Update
    ↓
Re-render with Results
```

---

## 💡 Tips

1. **Responsive Design**: Test on mobile, tablet, desktop
2. **Performance**: Lazy load heavy charts
3. **Animations**: Keep duration under 1s for UI
4. **Accessibility**: Use semantic HTML
5. **Testing**: Test API calls in Swagger UI first

---

Last Updated: 2026-05-11
