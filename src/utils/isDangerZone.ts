export function isDangerZone(
  spent: number,
  budget: number
) {
  return spent >= budget * 0.8;
}