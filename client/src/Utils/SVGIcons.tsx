export function IconBars({ fill = "#fff" }) {
  // <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
  return <svg xmlns="http://www.w3.org/2000/svg" fill={fill} viewBox="0 0 448 512">
      <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/>
    </svg>
}

export function ImageBGBorder({ stroke = "oklch(23.46% 0.032 67.29)" }) {
  return <svg width="205" height="239" viewBox="0 0 205 239" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M140.607 237.19L1.64774 82.4878L71.8 1.54211L203.669 106.836L140.607 237.19Z" stroke={stroke} stroke-width="2" />
  </svg>
}

export function IconSpinner({  className = "", fill = "#fff", }) {
  // https://github.com/n3r4zzurr0/svg-spinners/blob/main/svg-css/90-ring-with-bg.svg?short_path=89e51c1
  return <svg width="24" height="24" fill={fill} className={`animate-spin ${className}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/>
    <path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" />
  </svg>
}