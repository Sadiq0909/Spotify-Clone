let currentSong = new Audio();

function secondtominutes(seconds) {
  if(isNaN(seconds) || seconds <0){
    return "Invalid input"
  }
  const minutes = Math.floor(seconds/60);
  const rseconds = Math.floor(seconds%60);

  const formatminutes = String(minutes).padStart(2,"0");
  const formatseconds = String(rseconds).padStart(2,"0");

  return `${formatminutes}:${formatseconds}`;
}

async function getsongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/")
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response
  let as = div.getElementsByTagName("a")
  let songs = []
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1])
    }
  }
  return songs
}
const playMusic = (track,pause = false) => {
  currentSong.src = "/songs/" + track
  if(!pause){
    currentSong.play()
    play.src = "/svgs/pause.svg" 
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track)
  document.querySelector(".songtime").innerHTML = "00:00/00:00"
}


async function main() {
  let songs = await getsongs();
  playMusic(songs[0],true)

  let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
  for (const song of songs) {
    songul.innerHTML = songul.innerHTML + `<li>
                            <img src="svgs/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ").replaceAll("(PagalWorld.com.sb)", "")}</div>
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

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "/svgs/pause.svg"
    } else {
      currentSong.pause();
      play.src = "/svgs/play.svg"
    }
  })

  currentSong.addEventListener("timeupdate",()=>{
    document.querySelector(".songtime").innerHTML = `${secondtominutes(currentSong.currentTime)} / ${secondtominutes(currentSong.duration)}` 
    document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";
  })

  document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent =e.offsetX/e.target.getBoundingClientRect().width;
    document.querySelector(".circle").style.left = percent*100 +"%";
    currentSong.currentTime = currentSong.duration*percent;
  })


}
main()