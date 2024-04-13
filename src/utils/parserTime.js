

export const parseTimeToISO = (hours, minutes, day) => {
    const date = day === 'yesterday' ? new Date(new Date().setDate(new Date().getDate() - 1)) : new Date();
    date.setHours(hours, minutes, 0);
    const isoString = date.toISOString();
    return isoString;
};

export const getLocalIsoString = (date) => {
    const localDate = new Date(date);
    const localIsoString = new Date(localDate.getTime() - (localDate.getTimezoneOffset() * 60000)).toISOString().slice(0, -1);
    return localIsoString;
}