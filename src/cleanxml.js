/* Copyright 2014 Tristian Flanagan
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

'use strict';

/* Constants */
const isInt = /^-?\s*\d+$/;
const isDig = /^((?!0\d+$)(?:0|-?\s*\d+\.?\d*))$/;
const isSpaces = /^\s{1,}$/;
const radix = 10;

/* Clean XMl */
const cleanXML = function(xml){
	if(!xml || typeof(xml) !== 'object'){
		return xml;
	}

	const processNode = (node) => {
		let value, singulars,
			l = -1, i = -1, s = -1, e = -1;

		if(xml[node] instanceof Array && xml[node].length === 1){
			xml[node] = xml[node][0];
		}

		if(xml[node] instanceof Object){
			value = Object.keys(xml[node]);

			if(value.length === 1){
				l = node.length;

				singulars = [
					node.substring(0, l - 1),
					node.substring(0, l - 3) + 'y'
				];

				i = singulars.indexOf(value[0]);

				if(i !== -1){
					xml[node] = xml[node][singulars[i]];
				}
			}
		}

		if(typeof xml[node] === 'object'){
			xml[node] = cleanXML(xml[node]);
		}

		if(typeof xml[node] === 'string'){
			if(value && ('' + value).match(isSpaces)){
				xml[node] = value;
			}else{
				value = xml[node].trim();

				if(value.match(isDig)){
					if(value.match(isInt)){
						l = parseInt(value, radix);

						if(Math.abs(l) <= 9007199254740991){
							xml[node] = l;
						}
					}else{
						l = value.length;

						if(l <= 15){
							xml[node] = parseFloat(value);
						}else{
							for(i = 0, s = -1, e = -1; i < l && e - s <= 15; ++i){
								if(value.charAt(i) > 0){
									if (s === -1) {
										s = i;
									}else{
										e = i;
									}
								}
							}

							if(e - s <= 15){
								xml[node] = parseFloat(value);
							}
						}
					}
				}else{
					xml[node] = value;
				}
			}
		}

		if(node === '$'){
			Object.keys(xml[node]).forEach((property) => {
				xml[property] = xml[node][property];
			});

			delete xml[node];
		}
	};

	Object.keys(xml).forEach(processNode);

	return xml;
};

/* Export Module */
if(typeof(module) !== 'undefined' && module.exports){
	module.exports = cleanXML;
}else
if(typeof(define) === 'function' && define.amd){
	define('cleanXML', [], function(){
		return cleanXML;
	});
}
