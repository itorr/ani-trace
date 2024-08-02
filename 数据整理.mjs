let bangumis = map.v.bangumis.filter(b=>/全金|凉宫|幸运|clannad|轻音|冰菓|中二病|玉子|境界的|Free|甘城|吹响|五彩线|紫罗兰|弦音|二十世纪|摇曳|小市民|安达|恋爱小|哭泣少女|你的名字|博多豚|擅长捉|我们仍|向山进|言叶|青春笨|天体的|本田小|女子落|孤独摇|放学后|想哭的我|乒乓|莉可丽|相合之|月色真|星合之|极速车|玲音|末班列|卫宫家|干物妹|比宇宙更|只有我|夏洛特|雪之|请问您今|春宵苦短|四月是你|夜晚的水|侧耳倾听|Slow Start|道口时间|街角魔族/.test(b.cn)).sort((b,a)=>b.id - a.id)

// console.log(bangumis)
const Bangumis = {};

for (let index = 0; index < bangumis.length; index++) {
	const bangumi = bangumis[index];
	const name2 = (bangumi.cn||bangumi.name).replace(/剧场版|电影/,'').trim().slice(0, 3);
	// console.log(name2,bangumi)
	if (!Bangumis[name2]) {
		Bangumis[name2] = bangumi;
	}else{
		Bangumis[name2].points = Bangumis[name2].points.concat(bangumi.points);
	}
}



bangumis = Object.values(Bangumis).sort((b,a)=>b.id - a.id);

bangumis = bangumis.filter(b=>b.points.filter(p=>p.image).length).map(b=>{
	const name = b.cn || b.name;
	const images = b.points.filter(p=>p.image).map(p=>p.image.replace(/^\/images\//,''))

	return [
		name,
		images,
	]
})
copy(JSON.stringify(bangumis))
console.log(bangumis)