import { JSX } from "react";

export interface packagesDataTypes {
    tourType: string,
    dateRange: { startDate: Date | undefined, endDate: Date | undefined },
    priceRange: string,
}

export interface infoCardTypes {
    title: string,
    body: string;
    background: string;
    color: string;
    icon: JSX.Element;
}