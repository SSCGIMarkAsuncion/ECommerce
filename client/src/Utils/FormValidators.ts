export function checkPassword(value: string) {
  let upperCount = 0;
  let numCount = 0;
  let specialCount = 0;

  const num = {
    min: '0'.charCodeAt(0),
    max: '9'.charCodeAt(0)
  };
  const upper = {
    min: 'A'.charCodeAt(0),
    max: 'Z'.charCodeAt(0)
  };
  const lower = {
    min: 'a'.charCodeAt(0),
    max: 'z'.charCodeAt(0)
  };

  for (let i=0;i<value.length;i++) {
    const asciiCode = value.charCodeAt(i);
    if (asciiCode >= num.min && asciiCode <= num.max) {
      numCount++;
    }
    else if (asciiCode >= upper.min && asciiCode <= upper.max) {
      upperCount++;
    }
    else if (!(asciiCode >= lower.min && asciiCode <= lower.max)) {
      specialCount++;
    }
  }

  if (value.length < 8) {
    return "Password must be at least 8 characters long";
  }

  let errors = [];

  if (numCount < 1) {
    errors.push("Password must contain at least 1 number");
  }
  if (upperCount < 1) {
    errors.push("Password must contain at least 1 uppercase character");
  }
  if (specialCount < 1) {
    errors.push("Password must contain at least 1 special character");
  }

  if (errors.length > 0) {
    return errors.join("<br/>");
  }
  return "";
}