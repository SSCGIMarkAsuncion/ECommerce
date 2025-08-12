export interface PurchaseUnit {
  reference_id: string,
  shipping: {
    type: "SHIPPING",
    name: {
      full_name: string,
    },
    email_address: string,
    phone_number: {
      country_code: "63",
      national_number: string,
    },
    address: {
      address_line_1: string,
      address_line_2: string,
      admin_area_2: string, // "<city_town>"
      admin_area_1: "PHILIPPINES",
      postal_code: string,
      country_code: "PH"
    }
  },
  amount: {
    currency_code: "PHP",
    value: string
  },
};

function purchaseUnitFrom(obj: any[]) {
  if (!obj) return [];

  const units = obj.map((item) => {
    // console.log(item)
    return {
      reference_id: item.reference_id || "",
      shipping: {
        type: "SHIPPING",
        name: {
          full_name: item.shipping.full_name || "",
        },
        email_address: item.shipping.email_address || "",
        phone_number: {
          country_code: "63",
          national_number: item.shipping.phone_number || "",
        },
        address: {
          address_line_1: item.shipping.address_line_1 || "",
          address_line_2: item.shipping.address_line_2 || "",
          admin_area_2: item.shipping.admin_area_2 || "",
          admin_area_1: "PHILIPPINES",
          postal_code: item.shipping.postal_code,
          country_code: "PH"
        }
      },
      amount: {
        currency_code: item.amount.currency_code || "PHP",
        value: item.amount.value || 0
      },
    } as PurchaseUnit;
  });

  return units;
}

export class PaypalCreateOrderOpts {
  intent: "CAPTURE" | "AUTHORIZE";
  purchase_units: PurchaseUnit[];

  constructor(obj: any) {
    this.intent = obj.intent || "CAPTURE";
    this.purchase_units = purchaseUnitFrom(obj.purchase_units);
  }
}