const randNamesLength = 4;
const defaultScound = 60;

const getUnix = () => +new Date();

class Round {
	constructor({ names, answer, image, imageEl, created }){
		this.names = names;
		this.answer = answer;
		this.image = image;
		// this.imageEl = imageEl;
		this.created = created;
		this.value = null;
	}
	get name(){
		return this.names[this.answer];
	}
	get isRight(){
		return this.value === this.answer;
	}

}
class Game {
	constructor(){
		this.status = 'wait'; // wait, playing, end
		this.bangumis = [];
		this.startUnix = null;
		this.nowUnix = null;
		this.rounds = [];
		this.plusScound = 0;
		this.leftScound = null; // 剩余时间
		this.timer = 0;
		this.score = 0;
		this.nowRoundIndex = 0;
		this.progress = 0;
		this.createRounds(5);
		
		this.timer = setTimeout(() => {
			this.startGame();
		}, 1500);
	}
	get allRounds(){
		return this.rounds.slice(0,this.nowRoundIndex);
	}
	get Bangumis(){
		const { bangumis } = this;
		const Bangumis = {};
		for(const bangumi of bangumis){
			Bangumis[bangumi.name] = bangumi;
		}
	}
	get nowRound(){
		return this.rounds[this.nowRoundIndex];
	}
	get totalTime(){
		return Math.round(( this.endUnix - this.startUnix ) / 100) / 10;
	}
	startGame(){
		this.startUnix = getUnix();
		this.plusScound = 0; // 清空加时
		this.status = 'playing';
		this.nowRoundIndex = 0;
		this.step();
	}
	createRounds(length){
		const rounds = new Array(length).fill(0).map(()=>new Round(randOneAniCapture()));
		this.rounds.push(...rounds);
	}
	nextRound(){
		this.nowRoundIndex++;
		const lastRoundLength = this.rounds.length - this.nowRoundIndex;
		if(lastRoundLength < 3){ // 剩余回合小于3个
			this.createRounds(5);
		}
	}
	step(){
		clearTimeout(this.timer);
		this.nowUnix = getUnix();

		if(this.status === 'wait'){
			// 等待状态
		}
		else if(this.status === 'playing'){
			// 游戏中
			const { startUnix, nowUnix, rounds } = this;
			const leftScound = defaultScound + this.plusScound - Math.floor((nowUnix - startUnix) / 1000);
			this.leftScound = leftScound;
			this.progress = (nowUnix - startUnix + 1) / 1000 / (defaultScound + this.plusScound);

			if(leftScound <= 0){
				return this.toEnd();
			}

			this.timer = setTimeout(() => {
				this.step();
			},1000);
		}
	}
	
	toEnd(){
		this.status = 'end';
		this.endUnix = getUnix();
		// 计算分数
	}

	adjestScore(value){
		this.score += value;

		if(this.score < 0){
			this.score = 0;
		}
	}

	// 加时
	addScound(value){
		this.plusScound += value;
	}

	chooseValue(value){
		const { nowRound } = this;
		if(!nowRound){
			return;
		}
		nowRound.value = value;
		const unix = getUnix();
		const used = unix - nowRound.created;
		nowRound.chooseUnix = unix;
		nowRound.used = used;

		if(value === nowRound.answer){ // 答对
			nowRound.score = Math.max(10 - Math.floor(used / 3000),5);
			nowRound.plusScound = 1;
			console.log('答对');
		}
		else { // 答错
			nowRound.score = -5;
			nowRound.plusScound = -1;
			console.log('答错');
		}
		this.adjestScore(nowRound.score);
		this.addScound(nowRound.plusScound);

		this.nextRound();
	}
}

const v = new Vue({
	el: '.app',
	data: {
		game: null,
	},
	methods: {
		startGame(){
			this.game = new Game();
		},
	}
})


const flxImage = path=>`https://image.anitabi.cn/${path}?plan=h360`;

let bangumis = [];
let Bangumis = {};
let randNames = [];

class Bangumi {
	constructor({ name, images }){
		this.name = name;
		this.images = images;
		this.randImages();
	}
	randImages(){
		this.imageIndex = 0;
		this.images = this.images.sort(_=>Math.random()-0.5);
	}
	getImage(){
		this.imageIndex++;
		if(this.imageIndex >= this.images.length){
			this.randImages();
		}
		return flxImage(this.images[this.imageIndex]);
	}
}

fetch('bangumis.json')
	.then(r => r.json())
	.then(_bangumis => {
		_bangumis = _bangumis.filter(r=>!/小林/.test(r[0])).map(([name, images]) => (new Bangumi({ name, images })));
		for(const bangumi of _bangumis){
			Bangumis[bangumi.name] = bangumi;
		}
		bangumis = Object.freeze(_bangumis);
	})


const preloadImage = (url)=>{
	const img = new Image();
	img.src = url;
	return img;
}


const randOneAniCapture = ()=>{
	const names = getRandNames();
	const answer = Math.floor(Math.random() * randNamesLength);
	const name = names[answer];
	const bangumi = Bangumis[name];
	const image = bangumi.getImage();
	const imageEl = preloadImage(image);
	const created = getUnix();
	return { names, answer, image, imageEl, created };
}


const getRandNames = ()=>{
	if(randNames.length < randNamesLength){
		randNames = [
			...new Set([
				...randNames,
				...bangumis.map(b=>b.name).sort(_=>Math.random()-0.5)
			])
		];
	}

	return randNames.splice(0,randNamesLength);
}



// 快捷键功能
document.addEventListener('keydown', e => {
	const { key } = e;
	const selector = `[data-key="${key}"]`;
	const el = document.querySelector(selector);
	if(!el) return;
	el.setAttribute('data-hover', 'true');
});
document.addEventListener('keyup', e => {
	const { key } = e;
	const selector = `[data-key="${key}"]`;
	const el = document.querySelector(selector);
	if(!el) return;
	el.removeAttribute('data-hover');
	el.click();
});