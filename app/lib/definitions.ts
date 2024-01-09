declare module "@auth/core/types" {
  export interface User {
      emailVerified: boolean;
      isAdmin: boolean;
  }

  export interface Session {
    isAdmin: boolean | undefined;
  }
}

declare module "@auth/core/jwt" {
  export interface JWT {
   isAdmin: boolean | undefined;
  }
}

export type DirectionsProps = {
  currentLocation: google.maps.LatLngLiteral;
  dest: string;
  className?: string | undefined;
  setDestination: any;
}

export type DestinationProps = {
  className?: string | undefined;
  setDestination: any;
}

export type StartDrivingProps = {
  rtString: string;
  stLocation: google.maps.LatLngLiteral;
  destination: string;
  updateDestinationProps:React.Dispatch<React.SetStateAction<any>>;
}

export type DrivingTime = {
  arrivalTime: string;
  time: string;
  distance: string;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export interface ClientNavProps {
  children?: React.ReactNode;
  className?: string;
  setDestination?: any;
}