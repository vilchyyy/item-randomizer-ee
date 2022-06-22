import axios from "axios"
import { nanoid } from "nanoid"
import { useEffect, useState } from "react"
import useRandomChoice from "../hooks/useRandomChoice"

export async function getStaticProps() {
  const versions = await axios.get("http://ddragon.leagueoflegends.com/api/versions.json")
  const champions = await axios.get(`http://ddragon.leagueoflegends.com/cdn/${versions.data[0]}/data/en_US/champion.json`)
  const items = await axios.get(`http://ddragon.leagueoflegends.com/cdn/${versions.data[0]}/data/en_US/item.json`)
  return {
    props: {
        versions: versions.data,
        champions: Object.values(champions.data.data),
        items: Object.values(items.data.data),
    },

    revalidate: 5400,
  }
}

export default function Home(props) {
  
  const handleClick = () => {
    setRandomChampion(useRandomChoice(props.champions))}
  const [randomChampion, setRandomChampion] = useState(undefined)
  const [items, setItems] = useState([])

  useEffect(() => {
    setItems([])
    if (randomChampion === undefined) return
    const chances = Object.values(randomChampion.info).slice(0, 3)
    const adjustedChances = []
    for (let i of chances) {
      adjustedChances.push(i/(chances[0]+chances[1]+chances[2]))
    }

    const localItems = []
    let randomNumber 
    let randomItem

    for (let i = 0; i < 6; i++) {
      randomNumber = Math.random()
      if (randomNumber < adjustedChances[0]){
        localItems.push('ad')
      } else if (randomNumber < adjustedChances[0] + adjustedChances[1]) {
        localItems.push('tank')
      } else {
        localItems.push('ap')
      }
    }
    let localItems2
    localItems2 = []
    for (let i of localItems) {
      let found = false
      
      while (!found) {
        randomItem = useRandomChoice(props.items)      

        if (Object.keys(randomItem).includes("requiredAlly") || randomItem.maps["11"] === false || !Object.keys(randomItem).includes("depth") || localItems2.includes(randomItem.name)){
          continue
        }

        if (!Object.keys(randomItem).includes("inStore") && Object.keys(randomItem).includes("into") && randomItem.into[0][0] === "7" && localItems2.length === 0){
            if (i === "ad" && randomItem.tags.includes("Damage"))
              found = true
            else if (i === "ap" && randomItem.tags.includes("SpellDamage"))
              found = true            
            else if (i === "tank" && randomItem.tags.includes("Health")) {
              found = true
            }
            else if (i === "tank" && randomItem.tags.includes("SpellBlock")) {
              found = true
            }
            else if (i === "tank" && randomItem.tags.includes("Armor")) {
              found = true
            }
            else
              continue

            localItems2.push(randomItem.name)
            console.log(randomItem)
        } else if (localItems2.length !== 0 && !Object.keys(randomItem).includes("into")){
           if (i === "ad" && randomItem.tags.includes("Damage"))
              found = true
            else if (i === "ap" && randomItem.tags.includes("SpellDamage"))
              found = true
            else if (i === "tank" && randomItem.tags.includes("Health")) {
              found = true
            }
            else if (i === "tank" && randomItem.tags.includes("SpellBlock")) {
              found = true
            }
            else if (i === "tank" && randomItem.tags.includes("Armor")) {
              found = true
            }
            else
              continue

            localItems2.push(randomItem.name)
            console.log(randomItem)
        } else {
          console.log("bruh")
        }
      }

    }
    setItems(localItems2)
  }, [randomChampion])

  
  return (
  <div className="container">

    <button onClick={handleClick}>Random champ</button>
   
    {randomChampion !== undefined && <p>{randomChampion.name}</p>}

    {items.map((item) => (
      <p key={nanoid()}>{item}</p>
    ))}

    <style jsx>{`

    .container {
      height: 100vh;
      display: grid;
      place-content: center;
    }

    button {
      padding: 5em;
    }

    `}</style>
  </div>
  )
}
