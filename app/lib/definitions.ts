declare module "@auth/core/types" {
  export interface User {
      emailVerified: Date | null;
  }

  export interface Session {
    admin: boolean | undefined;
  }
}

declare module "@auth/core/jwt" {
  export interface JWT {
    admin: boolean | undefined;
  }
}

export type User = {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
  };

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
    rtString:string;
    stLocation:google.maps.LatLngLiteral;
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