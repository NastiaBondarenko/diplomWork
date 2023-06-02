import {statistic} from './Statistic.js';


class Analyzer {
	constructor () {
		this.MinProcentOfTasks = [15, 15, 5, 5, 5];
		this.TypeTasks = ['translationsToUkr', 'translationsToItal', 'compliance', 'choice', 'addition'];
	}

	wordUseEvaluation (userId, program, modules) {
		let wordsInProgram = [];
		let count = 0;
		for (let i = 0; i < program.length; i++) {
			if (program[i] == 1) {
				for (let j = 0; j < modules[i].words.length; i++) {
					wordsInProgram.push(modules[i].words.length[j].id);
				}
			}
		}
		for (let i = 0; i < wordsInProgram.length; i++) {
			if (statistic.getStaticticForWord(userId, wordsInProgram[i]) <= 0) {
				count++;
			}
		}
		return count;

	}

	countProsentOfTypeTask (modules, program) {
		let suma = 0;
		let numOfTasks = [0, 0, 0, 0, 0];
		let prosentOfTasks = [0, 0, 0, 0, 0];
		for (let i = 0; i < program.length; i++) {
			if (program[i] == 1) {
				for (let j = 0; j < this.TypeTasks.length; j++) {
					if (modules[i].type == this.TypeTasks[i]) {numOfTasks[i]++;}
				}
			}
		}
		for (let j = 0; j < this.numOfTasks.length; j++) {
			prosentOfTasks[j] = numOfTasks[j] * 100 / suma;
			if (modules[j].type == this.TypeTasks[j]) {numOfTasks[j]++;}
		}
		return prosentOfTasks;
	}

	evaluationFunction (userId, program, modules) {
		let statisticForTasks = statistic.getStaticticForTasks(userId);
		let prosentOfTaskInProgram = this.countProsentOfTypeTask(modules, program);
		let count = 0;
		for (let i = 0; i < prosentOfTaskInProgram.length; i++) {
			if (prosentOfTaskInProgram[i] > this.MinProcentOfTasks) {count += 50;}
			let desirableStatistics = 100 - statisticForTasks[i];
			if (Math.abs(prosentOfTaskInProgram[i] - desirableStatistics) < 15) {count += 50;}
		}
		return count;
	}
	evaluation (userId, program, modules) {
		let count = 0;
		count += this.evaluationFunction(userId, program, modules);
		count += this.wordUseEvaluation(userId, program, modules);
		return count;
	}


}


let analyzer = new Analyzer();
export {analyzer};

