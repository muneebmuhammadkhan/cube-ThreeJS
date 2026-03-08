

## 3D Interactive Cube Scene

A single-page interactive Three.js scene using React Three Fiber where a cube smoothly follows the user's cursor in 3D space.

### What will be built:

1. **3D Scene Setup** — Replace the Index page with a full-screen R3F Canvas containing a perspective camera, grid helper, and axes helper for spatial reference.

2. **Interactive Cube** — A colored cube that maps mouse movement to 3D position:
   - **Mouse X → Cube X** (horizontal movement)
   - **Mouse Y → Cube Z** (depth movement)
   - **Cube Y** oscillates using a sine wave based on time + distance from center, giving independent vertical motion

3. **Smooth Motion** — The cube uses lerp (linear interpolation) to smoothly follow target positions rather than snapping instantly.

4. **Lighting & Visuals** — Ambient + directional lighting, a grid on the ground plane, and axes helper so 3D movement is clearly perceptible.

5. **Animation Loop** — Uses R3F's `useFrame` hook for per-frame updates of position interpolation and Y-axis oscillation.

### Packages to install:
- `three` (v0.133+)
- `@react-three/fiber` (v8.18)
- `@react-three/drei` (v9.122.0)

