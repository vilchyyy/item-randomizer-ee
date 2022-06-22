export default function useRandomChoice(arr) {
    return arr[Math.floor(Math.random()*arr.length)]
}