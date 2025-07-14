app.service('OpenAIAssistantService', function ($q, $http) {
    const API_KEY = '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'; // Secure it with a backend in production
    const BASE_URL = 'https://api.openai.com/v1';
    const ASSISTANT_ID = 'asst_E46zx75Nmfmb75mBCvByi0vW';

    function makeHeaders() {
        return {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2'
        };
    }

    // 1. Create a thread
    this.createThread = function () {
        return $http.post(`${BASE_URL}/threads`, {}, { headers: makeHeaders() });
    };

    // 2. Add a message to the thread
    this.addMessageToThread = function (threadId, message) {
        return $http.post(`${BASE_URL}/threads/${threadId}/messages`, {
            role: 'user',
            content: message
        }, { headers: makeHeaders() });
    };

    // 3. Run the assistant
    this.runAssistant = function (threadId) {
        return $http.post(`${BASE_URL}/threads/${threadId}/runs`, {
            assistant_id: ASSISTANT_ID,
            stream: true // Tell OpenAI to stream events
        }, {
            headers: makeHeaders(),
            responseType: 'stream' // Important for chunked streaming
        });
    };

    // 4. Stream the run
    this.streamRun = function (threadId, onChunk, onDone) {
        const deferred = $q.defer();
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${BASE_URL}/threads/${threadId}/runs`, true);
        xhr.setRequestHeader('Authorization', `Bearer ${API_KEY}`);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('OpenAI-Beta', 'assistants=v2');
        let lastProcessedIndex = 0;
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.LOADING || xhr.readyState === XMLHttpRequest.DONE) {
                const newData = xhr.responseText.substring(lastProcessedIndex);
                lastProcessedIndex = xhr.responseText.length;
                const lines = newData.split('\n');
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (line && line.startsWith('data:')) {
                        const jsonData = line.substring(5).trim();
                        if (jsonData === '[DONE]') {
                            if (onDone) onDone(); // 👈 notify controller
                            deferred.resolve();

                        } else {
                            try {
                                const parsed = JSON.parse((jsonData));
                                //if (parsed.event === 'thread.message.delta') {
                                //    console.log('thread.message.delta ' + jsonData);    
                                //    const contentPiece = parsed.delta.content ?.[0] ?.text ?.value;
                                //    if (contentPiece) {
                                //        onChunk(contentPiece);
                                //    }
                                //}
                                if (parsed.delta && parsed.delta.content) {
                                    const contentPiece = parsed.delta.content[0]?.text?.value;
                                    if (contentPiece) {
                                        console.log("parsed " + contentPiece)
                                        onChunk(contentPiece); // Append text

                                    }
                                }

                            } catch (err) {
                                console.error('Streaming parse error:', err);
                            }
                        }
                    }
                }
            }
        };

        xhr.onerror = function () {
            deferred.reject('Stream error');
        };

        const data = JSON.stringify({
            assistant_id: ASSISTANT_ID,
            stream: true
        });

        xhr.send(data);

        return deferred.promise;
    };
});
app.controller('PI_OPENAIController', function ($scope, OpenAIAssistantService, $timeout, $cookies) {
    //$scope.userInput = '';
    //$scope.assistantResponse = '';
    //$scope.messages = [];
    //$scope.waiting = false;
    //let waitingTimer = null;
    //const WAIT_TIME_MS = 2000; // If no chunk after 2 seconds, show "waiting"
    //function startWaitingTimer() {
    //    if (waitingTimer) {
    //        $timeout.cancel(waitingTimer);
    //    }
    //    waitingTimer = $timeout(function () {
    //        $scope.waiting = true;
    //    }, WAIT_TIME_MS);
    //}
    //function resetWaitingTimer() {
    //    if (waitingTimer) {
    //        $timeout.cancel(waitingTimer);
    //        waitingTimer = null;
    //    }
    //    $scope.waiting = false;
    //    startWaitingTimer(); // Restart timer for next possible delay
    //}
    //$scope.sendToAssistant = function () {
    //    $scope.assistantResponse = '';
    //    $scope.waiting = false;

    //    OpenAIAssistantService.createThread()
    //        .then(function (threadRes) {
    //            const threadId = threadRes.data.id;
    //            $scope.messages.push({ sender: 'user', content: angular.copy($scope.userInput) });
    //            $scope.messages.push({ sender: 'assistant', content: '' });
    //            return OpenAIAssistantService.addMessageToThread(threadId, $scope.userInput)
    //                .then(function () {
    //                    $scope.userInput = '';
    //                    startWaitingTimer(); // Start waiting timer after sending
    //                    return OpenAIAssistantService.streamRun(threadId, function (chunk) {
    //                        //$scope.$apply(function () {
    //                        //    $scope.assistantResponse += chunk;
    //                        //    resetWaitingTimer(); // Got a chunk, reset waiting
    //                        //});

    //                        $scope.$apply(() => {
    //                            $scope.assistantResponse += chunk;
    //                            $scope.messages[$scope.messages.length - 1].content = $scope.assistantResponse;
    //                            resetWaitingTimer();
    //                        });
    //                    }, function () {
    //                        $scope.$apply(() => {
    //                            $scope.waiting = false;
    //                            if (waitingTimer) $timeout.cancel(waitingTimer);
    //                        });
    //                    });
    //                });

    //        }).catch(function (error) {
    //            console.error('Assistant Error:', error);
    //            $scope.assistantResponse = 'An error occurred.';
    //        });
    //};
    //});
    //OPENAI_API_KEY = sk - proj - In6dMwlU4kUBdcvtMn5J8LPG1yGT5KGXXzHdhG8W7sJmkk2fSd_PhR - pw - 2CHo_AptgCSGG4bPT3BlbkFJMWhSGsBVl - CXXJeSkoAGmdWu58QsIC_7nvmtWOnALMKhOs3_lIIfEiFaCBILpIPunzCj_s2QwA
    //ASSISTANT_ID = asst_E46zx75Nmfmb75mBCvByi0vW
    //SERP_API_KEY = c84f1d0994401d312db07f813118cd7b723d9c3ddf7068cd24f25b228bf444e4
    $scope.userInput = '';
    $scope.messages = [];
    $scope.SEARCH_KEY_WORD_LIST = [{ name: 'Top menu item for last week', icon: 'fa-square-list' }, { name: 'Show me 52 week trend', icon: 'fa-chart-waterfall' }]
    //thread.message.delta
    let assistantMsg = '';
    let fullText = '';
    $scope.waiting = true;
    let waitingTimer = null;
    const WAIT_TIME_MS = 2000; // If no chunk after 2 seconds, show "waiting"
    const speed = 100; // milliseconds per character
    let Think = 0;
    function typeWriter() {
        const text = "";
        const typingElement = document.getElementById("typingText");
        if (Think < text.length) {
            typingElement.innerHTML += text.charAt(Think);
            Think++;
            setTimeout(typeWriter, speed);
        } else {
            // After typing is done, add blinking dots
            const dots = document.createElement("span");
            dots.className = "dots";
            dots.innerHTML = '<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>';
            typingElement.appendChild(dots);
        }
    }

    $scope.SEARCH_KEY_BUTTON_Fn = function (_search) {
        $scope.userInput = _search.name;
        $scope.sendToAssistant();
    }

    function handleDeltaText(deltaChunk) {
        if (!deltaChunk) return;
        // Only append if it's not already there
        if (!fullText.endsWith(deltaChunk)) {
            $scope.messages[$scope.messages.length - 1].content += deltaChunk;
            // animate only new part
        }
    }

    function handleDeltaimg(IMG) {
        $scope.messages[$scope.messages.length - 1].IMG = IMG;

    }

    $scope.onmessage = function (event, IMG) {
        $scope.$apply(() => {

            if (IMG == undefined && event != undefined) {
                handleDeltaText(event, IMG);
            }
            else if (IMG != undefined) {
                handleDeltaimg(IMG);
            } else if (event == undefined && IMG == undefined) {
                $scope.waiting = false;
            }
        });
    };
    var API_PATH = "https://testingpowerinsights.wenodo.com/";
    var generaterandomvalue= $scope.$parent.generaterandom(12)
    $scope.sendToAssistant = function () {
        if ($scope.userInput.trim() != undefined && $scope.userInput.trim() != null && $scope.userInput.trim() != '') {
            Think = 0;
            $scope.waiting = true;
            $scope.messages.push({ sender: 'user', content: $scope.userInput });
            $scope.messages.push({ sender: 'assistant', content: '' });
            setTimeout(typeWriter, speed);
            const source = new EventSourcePolyfill(API_PATH + '/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userMessage: $scope.userInput, userId: generaterandomvalue })
            });
            source.onerror = function (err) {
                console.error('Stream error:', err);
                source.close();
            };
            $scope.userInput = '';
        }
        else {
            $scope.$parent.ShowAlertBox('Error', 'Please type something...', 3000);
        }
    };
    var count = 0;
    var typingTimer = null;
    if (typingTimer) {
        clearTimeout(typingTimer);
    }
    typingTimer = setTimeout(function () {
        $scope.$apply(() => {
            $scope.waiting = false;
            Think = 0;
        });
    }, 2000)
    function EventSourcePolyfill(url, options) {
        const xhr = new XMLHttpRequest();
        let lastProcessedIndex = 0;

        xhr.open(options.method || "POST", url);
        for (const h in options.headers) {
            xhr.setRequestHeader(h, options.headers[h]);
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 3 || xhr.readyState === 4) {
                const newData = xhr.responseText.substring(lastProcessedIndex);
                lastProcessedIndex = xhr.responseText.length;
                const lines = newData.split('\n');
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (line.startsWith("data:")) {
                        const payload = JSON.parse(line.slice(6));
                        if (!$scope.waiting && (payload.type === 'assistant_chunk' || payload.type === 'image')) {
                            $scope.$apply(() => {
                                $scope.waiting = true;
                            });
                        }
                        if (payload.type === 'assistant_chunk') {

                            $scope.onmessage(payload.content);


                        } else if (payload.type === 'image') {
                            var PATH = API_PATH + `/image/${payload.content}`;
                            $scope.onmessage('', PATH);

                        }
                        else if (payload.type === 'done') {
                            $scope.$apply(() => {
                                $scope.waiting = false;
                            });
                            $scope.onmessage(undefined, undefined);
                        }
                    }
                }
            }
        };

        xhr.onerror = function (err) {
            if (options.onerror) options.onerror(err);
        };
        xhr.send(options.body);
        return {
            close: () => xhr.abort()
        };
    }
});
