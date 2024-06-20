let currentSong = new Audio();


async function getsongs(){
  let a = await fetch("http://127.0.0.1:5500/songs/")
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response
  let as = div.getElementsByTagName("a")
  let songs = []
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if(element.href.endsWith(".mp3")){
      songs.push(element.href.split("/songs/")[1])
    }
  }
  return songs
}
const playMusic = (track)=>{
  currentSong.src = "/songs/"+track
  currentSong.play()
  play.src = "/svgs/pause.svg"
  document.querySelector(".songinfo").innerHTML = track
  document.querySelector(".songtime").innerHTML = "00:00/00:00"
}
async function main(){
  let songs = await getsongs();

  let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
  for (const song of songs) {
  songul.innerHTML = songul.innerHTML + `<li>
                            <img src="svgs/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20"," ").replaceAll("(PagalWorld.com.sb)","")}</div>
                                <div>Song artist</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img src = "svgs/play.svg" alt="">
                            </div>
                        </li>`   
  }
  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click",element=>{
      console.log(e.getElementsByTagName("div")[0].getElementsByTagName("div")[0].innerHTML);
      playMusic(e.getElementsByTagName("div")[0].getElementsByTagName("div")[0].innerHTML);
    })
  })

  play.addEventListener("click",()=>{
    if(currentSong.paused){
      currentSong.play();
      play.src = "/svgs/pause.svg"
    }else{
      currentSong.pause();
      play.src = "/svgs/play.svg"
    }
  })




}
main()