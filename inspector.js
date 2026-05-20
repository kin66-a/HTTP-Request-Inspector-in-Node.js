async function followRedirects(url){
	const chain =[]

	while(true){
		const res = await fetch(url, {redirect: 'manual'})
		
		chain.push({
			url: url,
			status: res.status
		})

		//redirect
		if(res.status >= 300 && res.status < 400){
			url = res.headers.get('location')
			if (!url) break
		}else{
			//final destination
			return {chain, finalRes: res}
		}
	}
}



async function main(){
	const url = process.argv[2] //taking URL from terminal: node inspector.js https://github.com

	if(!url){
		console.error('Usage: node inspector.js <url>')
		process.exit(1)
	}

	const start = Date.now()//timestamp befor request (ms)
	const {chain, finalRes}= await followRedirects(url)//fetch and await
	const end = Date.now()//timestamp aftter request


	//Status code
	console.log('=====================HTTP Request Inspector =======================\n')
	console.log('Status:', finalRes.status)
	console.log('Response Time', end - start, 'ms')


	//Redirect chain
	console.log('\n---------------------Redirect chain-----------------------')
	if(chain.length === 1){
		console.log('no redirects')
	}else{
		chain.forEach((hop, i) => {
			console.log(` ${i + 1}. [${hop.status}] ${hop.url}`)
		})
	}

	//Headers
	console.log('\n------------------------Headers-----------------------------------------')
	console.log('\nHeaders:')
	for(const [key, value] of finalRes.headers){
		console.log(`${key}: ${value}`)
	}


	//Cookies
	console.log('\nCookies:')
	const cookies = finalRes.headers.get('set-cookie')
	if (cookies) {
		cookies.split(',').forEach (cookie=> console.log(' ', cookie.trim()))
	}else{
		console.log(' none')
	}


}

main()