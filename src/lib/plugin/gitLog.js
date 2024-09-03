import { spawnSync, spawn } from 'child_process';

const dummyDatetime = [
	{
		datetime: new Date().toISOString(),
		comment: 'dummy',
		author: 'unknown'
	}
];

function getGitCommand(path) {
	return ['log', '--follow', '--pretty=format:%ad,%s,%an', '--date=format:%Y-%m-%dT%H:%M%z', path];
}

function gitLogParser(stdout) {
	return stdout
		? stdout.split('\n').map((line) => {
				const [datetime, comment, author] = line.split(',');
				return { datetime, comment, author };
			})
		: dummyDatetime;
}

/**
 * Git 로그 정보를 추출하는 함수
 * @param filePath
 * @returns {{datetime: string, comment: string}[]}
 */
export function getGitLogSync(filePath) {
	const gitCommand = getGitCommand(filePath);
	const { stdout } = spawnSync('git', gitCommand, { shell: false, encoding: 'utf8' });

	return gitLogParser(stdout);
}

/**
 * Git 로그 정보를 비동기적으로 추출하는 함수
 * @param filePath
 * @returns {Promise<{datetime: string, comment: string}[]>}
 */
export async function getGitLogAsync(filePath) {
	const gitCommand = getGitCommand(filePath);
	return new Promise((resolve, reject) => {
		const child = spawn('git', gitCommand, { shell: false });

		let stdout = '';
		let stderr = '';

		child.stdout.on('data', (data) => {
			stdout += data;
		});

		child.stderr.on('data', (data) => {
			stderr += data;
		});

		child.on('close', (code) => {
			if (code === 0) {
				const output = gitLogParser(stdout);

				// 만약 출력이 비어있다면, 더미 데이터를 반환합니다.
				if (output.length === 0) {
					resolve(dummyDatetime);
				} else {
					resolve(output);
				}
			} else {
				console.error(`Git command failed with code ${code}:`, stderr);
				resolve(dummyDatetime);
			}
		});

		child.on('error', (error) => {
			console.error('Failed to execute git command:', error);
			resolve(dummyDatetime);
		});
	});
}
