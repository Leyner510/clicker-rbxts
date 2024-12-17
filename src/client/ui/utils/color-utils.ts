export function brighten(color: Color3, brightness: number, vibrancy = 0.5) {
	const [h, s, v] = color.ToHSV();
	return Color3.fromHSV(h, math.clamp(s - brightness * vibrancy, 0, 1), math.clamp(v + brightness, 0, 1));
}