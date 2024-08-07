export function parseISOString(s) {
    const b = s.split(/\D+/);
    // return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
    const utcDate = new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
    const estDate = new Date(utcDate.getTime() + (4 * 60 * 60 * 1000));
    return estDate;
}