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
    return {
      reference_id: item.reference_id || "",
      shipping: {
        type: "SHIPPING",
        name: {
          full_name: item.full_name || "",
        },
        email_address: item.email_address || "",
        phone_number: {
          country_code: "63",
          national_number: item.national_number || "",
        },
        address: {
          address_line_1: item.address_line_1 || "",
          address_line_2: item.address_line_2 || "",
          admin_area_2: item.admin_area_2 || "",
          admin_area_1: "PHILIPPINES",
          postal_code: item.postal_code,
          country_code: "PH"
        }
      },
      amount: {
        currency_code: "PHP",
        value: item.value || 0
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