let currentSong = new Audio();
let songs;
let currfolder;


function secondtominutes(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00"
  }
  const minutes = Math.floor(seconds / 60);
  const rseconds = Math.floor(seconds % 60);

  const formatminutes = String(minutes).padStart(2, "0");
  const formatseconds = String(rseconds).padStart(2, "0");

  return `${formatminutes}:${formatseconds}`;
}

async function getsongs(folder) {
  currfolder = folder
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response
  let as = div.getElementsByTagName("a")
  songs = []
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1])
    }
  }

  let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
  songul.innerHTML = ""
  for (const song of songs) {
    songul.innerHTML = songul.innerHTML + `<li>
                            <img src="svgs/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Song artist</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img src = "svgs/play.svg" alt="">
                            </div>
                        </li>`
  }
  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      console.log(e.getElementsByTagName("div")[0].getElementsByTagName("div")[0].innerHTML);
      playMusic(e.getElementsByTagName("div")[0].getElementsByTagName("div")[0].innerHTML);
    })
  })
  return songs;
}
const playMusic = (track, pause = false) => {
  currentSong.src = `/${currfolder}/` + track
  if (!pause) {
    currentSong.play()
    play.src = "/svgs/pause.svg"
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track)
  document.querySelector(".songtime").innerHTML = "00:00/00:00"

}

async function displayalbums() {
  let a = await fetch(`http://127.0.0.1:5500/songs/`)
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response
  let card_container = document.querySelector(".card_container")
  let anchors = div.getElementsByTagName("a")
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    
    if (e.href.includes("/songs/")) {
      let folder = e.href.split("/").slice(-1)[0]
      let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
      let response = await a.json();
      console.log(response)
      card_container.innerHTML = card_container.innerHTML +`<div data-folder="${folder}" class="card ">
                        <div class="play">
                            <img src="svgs/playlogo.svg" alt="">
                            </div>
                        <img class = "imglogo" src="/songs/${folder}/cover1.jpeg" alt="">
                        <h3>${response.title}</h3>
                        <p>${response.description}</p>
                        </div>`
                      }
                    }
  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
      songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0])
    })
  })
}

async function main() {
  await getsongs("songs/Arijit");
  playMusic(songs[0], true)

  displayalbums()

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "/svgs/pause.svg"
    } else {
      currentSong.pause();
      play.src = "/svgs/play.svg"
    }
  })

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondtominutes(currentSong.currentTime)} / ${secondtominutes(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  })

  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = e.offsetX / e.target.getBoundingClientRect().width;
    document.querySelector(".circle").style.left = percent * 100 + "%";
    currentSong.currentTime = currentSong.duration * percent;
  })

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0%"
  })
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%"
  })
  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1],false);
    }
  })
  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1],false);
    }
  })
  

}


main()


// http://127.0.0.1:5500/songs/Punjabi/One%20Love_64(PagalWorld.com.sb).mp3