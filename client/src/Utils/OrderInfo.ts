export class OrderInfo {
  full_name: string = "";
  email_address: string = "";
  phone_number: string = "";
  address_line_1: string = "";
  admin_area_2: string = "";
  postal_code: string = "";
  payment_method: "cod" | "paypal" = "cod";

  toJson() {
    return JSON.stringify(this);
  }
}