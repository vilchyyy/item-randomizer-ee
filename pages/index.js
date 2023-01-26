import axios from "axios"
import { nanoid } from "nanoid"
import Image from "next/image"
import { useEffect, useState } from "react"
import RandomChoice from "../hooks/RandomChoice"

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
    setRandomChampion(RandomChoice(props.champions))
    
  }

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
    let localItems3 = []
    let localItems2
    localItems2 = []
    for (let i of localItems) {
      let found = false
      
      while (!found) {
        randomItem = RandomChoice(props.items)      

        if (Object.keys(randomItem).includes("requiredAlly") || randomItem.maps["11"] === false || !Object.keys(randomItem).includes("depth") || localItems3.includes(randomItem.name) || randomItem.name === "Equinox"){
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

              localItems3.push(randomItem.name)
              localItems2.push([randomItem.name, randomItem.image.full])
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

            localItems3.push(randomItem.name)
            localItems2.push([randomItem.name, randomItem.image.full])
            console.log(randomItem)
        } else {
          console.log("bruh")
        }
      }

    }
    setItems(localItems2)
  }, [randomChampion, props.items])

  

  return (
  <div className="root">
  <div className="container">

    <button className="randomChampButton" onClick={handleClick}>Random champ</button>
   
    {randomChampion !== undefined && <div className="champion"><p>{randomChampion.name}</p><Image className="champion-img" height={120} width={120} src={`http://ddragon.leagueoflegends.com/cdn/${props.versions[0]}/img/champion/${randomChampion.id}.png`} alt={`picture of ${randomChampion.name}`}/></div>}

    {items.map((item) => (
      <div className="item" key={nanoid()}><p>{item[0]}</p><Image alt={item[0]} height={70} width={70} src={`http://ddragon.leagueoflegends.com/cdn/${props.versions[0]}/img/item/${item[1]}`}/></div>
    ))}

    <style jsx>{`

      .randomChampButton {
        border: none;
        background-color: #1a1a1a;
        color: white;
        cursor: pointer;
        font-size: 1.5em;
        padding: 1em;
        border-radius: 10px;
        transition: transform 0.2s;
      }

      .randomChampButton:hover {
        transform: scale(1.1);
      }

    .champion {
      display: flex;
      width: 100%;
      justify-content: space-between;
      margin: 1em 0;
    }

    .container {
      height: 100vh;
      display: grid;
      place-content: center;
      width: 100vw;
    }

    .item {
      display: flex;
      width: 20em;
      margin-bottom: 1em;
      justify-content: space-between;
    }

    button {
      padding: 4em;
    }

    `}</style>
  </div>
  </div>
  )
}
