import parseDuration from "./parseDuration";

//sort arr by title in descending order
const titleDescending = (arr, setArr) => {
    const sortedArr = [...arr].sort((a, b) => {
        if (a.name < b.name) return 1;
        if (a.name > b.name) return -1;
        return 0;
      });
    
      setArr(sortedArr);
}

const titleAscending = (arr, setArr) => {
    const sortedArr = [...arr].sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    });
    
    setArr(sortedArr);
}

const durationAscending = (arr, setArr) => {
    // Sort the array based on parsed duration
    const sortedArr = [...arr].sort((a, b) => parseDuration(a.duration) - parseDuration(b.duration));

    // Update state with sorted array
    setArr(sortedArr);
}

const durationDescending = (arr, setArr) => {
    // Sort the array based on parsed duration
    const sortedArr = [...arr].sort((a, b) => parseDuration(b.duration) - parseDuration(a.duration));

    // Update state with sorted array
    setArr(sortedArr);
}

export {
    titleDescending,
    titleAscending,
    durationDescending,
    durationAscending
}