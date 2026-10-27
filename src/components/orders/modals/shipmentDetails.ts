export type ShipmentDetails =
  | {
      method: "Self Delivery";
      driverName: string;
      driverPhone: string;
    }
  | {
      method: "Ship Rocket";
      trackingNumber: string;
    };
