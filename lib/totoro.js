var logging = require('winston');
var path = require('path')
var fs = require('fs')
var thrillRunner = require('thrill').runner
var createRunner = require('./create-runner')


var cfg = {
	autoAdapt:false,
	stream:true,
	verbose:true,
	host:"localhost:9200"
}


function main(){
	
	var dir = path.resolve('../../events')
	var testDir = findTestDir(dir)
	var runner = findRunner(testDir)
	if(!runner){
		runner = createRunner(testDir)
	}
	
	cfg.serve = dir
	cfg.run = runner

	return
	
	thrillRunner(cfg, function(passed){
		if(passed instanceof Error){
			throw passed;
		}
		if(passed){
			process.exit(0);
		} else {
			process.exit(1);
		}
	})
}


/**
 * 查找指定目录的测试目录
 * 
 * @param dir
 * @returns 查找到的测试目录或抛错
 */
function findTestDir(dir){
	var names = ['test', 'tests']
	for(var i = 0; i< names.length; i++){
		var testDir = path.join(dir, names[i])
		if(fs.existsSync(testDir)){
			logging.debug('found test dir: ' + testDir)
			return testDir
		}
	}
	logging.error('not found test dir')
}


/**
 * 查找指定测试目录的 runner 文件
 * 
 * @param testDir
 * @returns 查找到的 runner 文件路径或空
 */
function findRunner(testDir){
	var names = ['runner.html', 'index.html']
	for(var i = 0; i< names.length; i++){
		var runner = path.join(testDir, names[i])
		if(fs.existsSync(runner)){
			logging.debug('found runner: ' + runner)
			return runner
		}
	}
	logging.debug('not found runner')
}


module.exports = main


main()
