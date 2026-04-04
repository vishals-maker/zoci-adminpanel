

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useSelector } from "react-redux";

export function isoToIST(isoString) {
  const date = new Date(isoString); // Convert ISO string to Date object
  return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
}
export function isoToISTDateOnly(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
  });
}


export function isoToISTTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
  });
}
export function blogDateConverter(isoString) {
  const date = new Date(isoString);

  const day = date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
  });

  const month = date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    month: "short", // ⬅️ short month name
  });

  return [day, month];
}


export const isoToDDMMYYYY = (isoDate) => {
  const d = new Date(isoDate);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};


export const getChangedKeys = (oldObj, newObj) => {
  const changed = {};

  for (const key in newObj) {
    const oldValue = oldObj[key];
    const newValue = newObj[key];

    // Compare values (shallow comparison)
    if (oldValue !== newValue) {
      changed[key] =  newValue ;
    }
  }

 return changed;
};



export function compareNewAndOldObject({oldObj, newObj}) {
  const changed = {};

  for (const key in newObj) {
    const oldVal = oldObj[key];
    const newVal = newObj[key];

    // Array fields — hamesha newVal rakho as-is
    if (Array.isArray(newVal)) {
      changed[key] = newVal;
      continue;
    }

    // Object fields (images jaise nested objects)
    if (typeof newVal === "object" && newVal !== null) {
      changed[key] = newVal;
      continue;
    }

    // Primitive comparison
    if (oldVal !== newVal) {
      changed[key] = newVal;
    }
  }

  return changed;
}
export const isoTODate = (isoDate) => {
  return new Date(isoDate).toISOString().slice(0, 10);
};


export function generate4DigitRandomNumber() {
  return `SKU-${Math.floor(1000 + Math.random() * 9000)}`;
}

dayjs.extend(utc);

export function isoToUTC(isoString) {
  return dayjs(isoString).utc().format("YYYY-MM-DD HH:mm:ss");
}


 
 
export function formatDateUTC(isoDate) {
  const date = new Date(isoDate);

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

export function convertUtcToIst(utcString) {
    const utcDate = new Date(utcString);
    const options = {
        timeZone: "Asia/Kolkata", // IST ज़ोन
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    };

    return utcDate.toLocaleString("en-IN",options);
}

