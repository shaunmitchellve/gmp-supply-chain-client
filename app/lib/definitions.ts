declare module '@auth/core/types' {
  export interface User {
    emailVerified: boolean;
    isAdmin: boolean;
  }

  export interface Session {
    isAdmin: boolean | undefined;
  }
}

declare module '@auth/core/jwt' {
  export interface JWT {
    isAdmin: boolean | undefined;
  }
}

export type DirectionsProps = {
  currentLocation: google.maps.LatLngLiteral;
  dest: string;
  className?: string | undefined;
  setDestination: any;
};

export type DestinationProps = {
  className?: string | undefined;
  setDestination: any;
};

export type StartDrivingProps = {
  rtString: string;
  stLocation: google.maps.LatLngLiteral;
  destination: string;
  updateDestinationProps: React.Dispatch<React.SetStateAction<any>>;
};

export type DrivingTime = {
  arrivalTime: string;
  time: string;
  distance: string;
};

export type GeoCodingResponse = {
  results: Array<GeocodingResult>;
  status: string;
};

interface GeocodingResult {
  address_components: Array<AddressComponent>;
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  types: Array<string>;
}

interface AddressComponent {
  long_name: string;
  short_name: string;
  formatted_address: string;
  types: Array<string>;
  place_id: string;
}

interface Geometry {
  location: google.maps.LatLngLiteral;
  location_type: string;
  viewport: Viewport;
}

interface Viewport {
  northeast: google.maps.LatLngLiteral;
  southwest: google.maps.LatLngLiteral;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export interface ClientNavProps {
  className?: string;
  setDestination?: any;
}

export interface Legs {
  lat: number;
  lng: number;
  timestamp: Date;
}

export interface ReturnTrips {
  id: string;
  //uid: string;
  email: string;
  startLocation: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;
  // insertTimeStamp: Date | null;
  // route: Array<Legs>;
}
