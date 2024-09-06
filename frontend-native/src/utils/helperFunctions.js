export function parseISOString(s) {
    const b = s.split(/\D+/);
    // return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
    const utcDate = new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
    const estDate = new Date(utcDate.getTime() + (4 * 60 * 60 * 1000));
    return estDate;
}

export function arraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;

    // Sort and compare each element
    const sortedArr1 = [...arr1].sort();
    const sortedArr2 = [...arr2].sort();

    for (let i = 0; i < sortedArr1.length; i++) {
        if (sortedArr1[i] !== sortedArr2[i]) {
            return false;
        }
    }
    return true;
}