/**
 * Keep the scroll scene conditional on the space its real content needs.
 * Font scaling, viewport height and browser zoom can all change that space.
 * @param {{width:number,height:number,titleWidth:number,titleHeight:number,copyTop:number,copyHeight:number}} size
 */
export function introLayout(size) {
  const desktop = size.width >= 1024 && size.height > 600;
  const flowing = size.height <= 600 || size.copyTop + size.copyHeight > size.height - 70;
  const heroY = size.height * (desktop ? 0.605 : 0.465);
  const heroScale = Math.min(
    (size.width * (desktop ? 0.73 : 0.91)) / Math.max(1, size.titleWidth),
    (size.height * 0.86 - heroY) / (Math.max(1, size.titleHeight) * 0.7)
  );
  return { desktop, flowing, heroY, heroScale };
}
