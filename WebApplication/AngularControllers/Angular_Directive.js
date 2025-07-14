app.filter('trustAsResourceUrl', ['$sce', function ($sce) {
    return function (val) {
        return $sce.trustAsResourceUrl(val);
    };
}]);
app.filter('markdown', function () {
    return function (input) {
        if (!input) return '';
        return marked.parse(input);
    };
});
app.filter('trim', function () {
    return function (value) {
        if (!angular.isString(value)) {
            return value;
        }
        return value.replace(/^\s+|\s+$/g, ''); // you could use .trim, but it's not going to work in IE<9
    };
});
app.filter('makePositive', function () {
    return function (num) { return Math.abs(num); }
});
app.directive('checkEmail', [function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, el, attr, ctrl) {
            ctrl.$validators.checkEmail = function (modelVal, viewVal) {
                console.log(viewVal);
                // now return true or false if viewValue is considered valid
                var regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
                var isValid = regex.test(viewVal);
                // but you also have an opportunity to do your DOM manipulation
                el.toggleClass('input-valid', isValid);
                el.toggleClass('input-invalid', !isValid);
                return isValid;
            }
        }
    }
}]);
function utcToLocal($filter) {
    return function (utcDateString, format) {
        if (!utcDateString) {
            return;
        }
        // append 'Z' to the date string to indicate UTC time if the timezone isn't already specified
        if (utcDateString.indexOf('Z') === -1 && utcDateString.indexOf('+') === -1) {
            utcDateString += 'Z';
        }
        return $filter('date')(utcDateString, format);
    };
};
app.filter('utcToLocal', utcToLocal);
app.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            var keys = Object.keys(props);

            items.forEach(function (item) {
                var itemMatches = false;

                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});
app.directive('typeaheadFocusTrigger', function () {
    return {
        limit: 'A',
        link: function (scope, element, attrs) {
            $(element).on('click', function (e) {
                var $target = $(e.target);
                var origVal = $target.eq(0).val();
                $target.eq(0).val('').trigger('input')
                    .eq(0).val(origVal).trigger('input');
            });
        }
    }
});
app.directive('onlyUrl', function (AppVal) {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                //var transformedInput = text.replace(/[^0-9]/g, '');
                //if (transformedInput !== text) {
                //}
                var transformedInput = text.replace(/\s/g, '');
                ngModelCtrl.$setViewValue(transformedInput);
                ngModelCtrl.$render();
                //  scope.URL_FOR_ALL = transformedInput;
                return text;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
app.filter('unique', function () {
    return function (collection, keyname) {
        var output = [],
            keys = [];
        angular.forEach(collection, function (item) {
            var key = item[keyname];
            if (keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
            }
        });
        return output;
    };
});
app.filter('sumOfModValue', function () {
    return function (data, key) {
        if (angular.isUndefined(data) && angular.isUndefined(key))
            return 0;
        var sum = 0;
        angular.forEach(data, function (v, k) {
            if (v[key] == undefined || v[key] == null || v[key] == "") {
                sum = sum + parseFloat(0);
            }
            else {
                sum = sum + Math.abs(parseFloat(parseFloat(v[key]).toFixed(2)))
            }

        });
        return sum.toFixed(2);
    }
})
app.filter('sumOfValue', function () {
    return function (data, key) {
        if (angular.isUndefined(data) && angular.isUndefined(key))
            return 0;
        var sum = 0;
        angular.forEach(data, function (v, k) {
            if (v[key] == undefined || v[key] == null || v[key] == "") {
                //sum = sum + parseFloat(0);
            }
            else {
                sum = sum + parseFloat(v[key]);
            }

        });
        return sum.toFixed(2);
    }
})
app.filter('sumOfArray', function () {
    return function (data) {
        var sum = 0;
        angular.forEach(data, function (v) {
            if (v == undefined || v == null || v == "") {
                //sum = sum + parseFloat(0);
            }
            else {
                sum = sum + parseFloat(v);
            }
        });
        return sum.toFixed(2);
    }
});
app.directive('noBlankPaste', function () {
    return {
        restrict: 'A',
        link: function (scope, element) {
            element.on('paste', function (event) {
                event.preventDefault();
                let clipboardData = event.clipboardData || window.clipboardData;
                let pastedData = clipboardData.getData('Text').trim();
                scope.$apply(function () {
                    element.val(pastedData);
                });
            });
        }
    };
});
app.filter('maxmindate', function () {
    return function (data, key) {
        if (angular.isUndefined(data) && angular.isUndefined(key))
            return 0;
        var dates = [];
        angular.forEach(data, function (v, k) {
            if (v[key] == undefined || v[key] == null || v[key] == "") {
                //sum = sum + parseFloat(0);
            }
            else {
                dates.push(new Date(v[key]));
            }

        });
        return new Date(Math.max.apply(null, dates)) + ":;:" + new Date(Math.min.apply(null, dates));
    }
})
app.filter('mindate', function () {
    return function (data, key) {
        if (angular.isUndefined(data) && angular.isUndefined(key))
            return 0;
        var dates = 0;
        angular.forEach(data, function (v, k) {
            if (v[key] == undefined || v[key] == null || v[key] == "") {
                //sum = sum + parseFloat(0);
            }
            else {
                dates.push(new Date(v[key]));
            }

        });
        return new Date(Math.min.apply(null, dates));
    }
})
app.filter('highlight', function ($sce) {
    return function (text, phrase) {
        if (phrase) text = text.replace(new RegExp('(' + phrase + ')', 'gi'),
            '<span style="font-weight:bold;text-decoration: underline;color:#000;background-color:#bcffb6">$1</span>');
        return $sce.trustAsHtml(text);
    }
});
app.filter('sortBy', function () {
    return function (input, attribute) {
        if (!angular.isObject(input)) return input;

        var array = [];
        for (var objectKey in input) {
            array.push(input[objectKey]);
        }

        array.sort(function (a, b) {
            a = parseInt(a[attribute]);
            b = parseInt(b[attribute]);
            return a - b;
        });
        return array;
    }
});
app.filter('toDate', function () {
    return function (items) {
        return items == null || items == undefined || items == '' || items == '-' ? '' : new Date(items);
    };
});
app.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.onFinishRender);
                });
            }
        }
    }
});
app.directive('onFinish', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            $timeout(function () {
                console.log(attr.onFinish)
                scope.$emit(attr.onFinish);
            });
        }
    }
});
//<div empty-grid> </div>
app.directive('emptyGrid', function () {
    return {
        restrict: 'A',
        template: '<div class="alert bg-custom-blue">No Record Found!</div>',
        scope: {
        }
    };
});
app.directive('emptyComponent', function () {
    return {
        restrict: 'A',
        template: '<div class="alert-light-danger p-2 b-r-5 txt-danger text-center"> <i class="fa-light fa-exclamation-triangle fa-4x mt-3"></i> <span class="d-block mt-3">You do not have access to this page.</span></div>',
        scope: {
        }
    };
});


//<div server-process></div>
app.directive('serverProcess', function () {
    return {
        restrict: 'A',
        template: '<img src="../images/Loading.gif" /> Process...',
        scope: {
        }
    };
});
app.filter('customSplitString', function () {
    return function (input) {
        var arr = input.split(',');
        return arr;
    };
});
app.directive('modal', function () {
    return {
        template: '<div class="modal fade">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            '<div >' +
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>' +
            '<h4 class="modal-title"></h4>' +
            '</div>' +
            '<div class="modal-body" ></div>' +
            '</div>' +
            '</div>' +
            '</div>',
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: true,
        link: function postLink(scope, element, attrs) {
            scope.title = attrs.title;

            scope.$watch(attrs.visible, function (value) {
                if (value == true)
                    $(element).modal('show');
                else
                    $(element).modal('hide');
            });

            $(element).on('shown.bs.modal', function () {
                scope.$apply(function () {
                    scope.$parent[attrs.visible] = true;
                });
            });

            $(element).on('hidden.bs.modal', function () {
                scope.$apply(function () {
                    scope.$parent[attrs.visible] = false;
                });
            });
        }
    };
});
app.directive('backButton', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function () {
                history.back();
                scope.$apply();
            });
        }
    };
});
app.directive('onFinishInnerRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.onFinishInnerRender);
                });
            }
        }
    }
});
app.directive('clickOnce', function ($timeout) {
    var delay = 3000;   // min milliseconds between clicks

    return {
        restrict: 'A',
        priority: -1,   // cause out postLink function to execute before native `ngClick`'s
        // ensuring that we can stop the propagation of the 'click' event
        // before it reaches `ngClick`'s listener
        link: function (scope, elem) {
            var disabled = false;
            function onClick(evt) {
                if (disabled) {
                    evt.preventDefault();
                    evt.stopImmediatePropagation();
                } else {
                    disabled = true;
                    $timeout(function () { disabled = false; }, delay, false);
                }
            }
            scope.$on('$destroy', function () { elem.off('click', onClick); });
            elem.on('click', onClick);
        }
    };
});
app.directive('ngFiles', ['$parse', function ($parse) {
    function fn_link(scope, element, attrs) {

        var onChange = $parse(attrs.ngFiles);

        element.on('change', function (event) {
            onChange(scope, { $files: event.target.files });
        });
        element.on('dragover', function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
        element.on('dragenter', function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
        element.on('drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (e.originalEvent.dataTransfer) {
                if (e.originalEvent.dataTransfer.files.length > 0) {
                    //upload(e.originalEvent.dataTransfer.files);
                    onChange(scope, { $files: e.originalEvent.dataTransfer.files });
                }
            }
            return false;
        });

    };

    return {
        link: fn_link
    }
}]);
app.directive('onlyDigits', function (AppVal) {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function (val) {
                if (angular.isUndefined(val)) {
                    var val = '';
                }
                var clean = val.replace(/[^-0-9\.]/g, '');
                var negativeCheck = clean.split('-');
                var decimalCheck = clean.split('.');
                if (!angular.isUndefined(negativeCheck[1])) {
                    negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                    clean = negativeCheck[0] + '-' + negativeCheck[1];
                    if (negativeCheck[0].length > 0) {
                        clean = negativeCheck[0];
                    }

                }

                if (!angular.isUndefined(decimalCheck[1])) {
                    decimalCheck[1] = decimalCheck[1].slice(0, AppVal.decimalPlaces_UnitPrice);
                    clean = decimalCheck[0] + '.' + decimalCheck[1];
                }

                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });

            element.bind('keypress', function (event) {
                if (event.keyCode === 32 || event.keyCode === 45) {
                    event.preventDefault();
                }
            });
        }
    };
});
app.directive('date', function (dateFilter) {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            var dateFormat = attrs['date'] || 'HH:mm';
            ctrl.$formatters.unshift(function (modelValue) {
                return dateFilter(dateFilter(new Date(modelValue), dateFormat));
            });
        }
    };
});
app.directive('fileDropzone', function () {
    return {
        restrict: 'A',
        scope: {
            file: '=',
            fileName: '='
        },
        link: function (scope, element, attrs) {
            var checkSize,
                isTypeValid,
                processDragOverOrEnter,
                validMimeTypes;

            processDragOverOrEnter = function (event) {
                if (event != null) {
                    event.preventDefault();
                }
                event.dataTransfer.effectAllowed = 'copy';
                return false;
            };

            validMimeTypes = attrs.fileDropzone;

            checkSize = function (size) {
                var _ref;
                if (((_ref = attrs.maxFileSize) === (void 0) || _ref === '') || (size / 1024) / 1024 < attrs.maxFileSize) {
                    return true;
                } else {
                    alert("File must be smaller than " + attrs.maxFileSize + " MB");
                    return false;
                }
            };

            isTypeValid = function (type) {
                if ((validMimeTypes === (void 0) || validMimeTypes === '') || validMimeTypes.indexOf(type) > -1) {
                    return true;
                } else {
                    alert("Invalid file type.  File must be one of following types " + validMimeTypes);
                    return false;
                }
            };

            element.bind('dragover', processDragOverOrEnter);
            element.bind('dragenter', processDragOverOrEnter);

            return element.bind('drop', function (event) {
                var file, name, reader, size, type;
                if (event != null) {
                    event.preventDefault();
                }
                reader = new FileReader();
                reader.onload = function (evt) {
                    if (checkSize(size) && isTypeValid(type)) {
                        return scope.$apply(function () {
                            scope.file = evt.target.result;
                            if (angular.isString(scope.fileName)) {
                                return scope.fileName = name;
                            }
                        });
                    }
                };
                file = event.dataTransfer.files[0];
                name = file.name;
                type = file.type;
                size = file.size;
                reader.readAsDataURL(file);
                return false;
            });
        }
    };
})
    .directive("fileread", [function () {
        return {
            scope: {
                fileread: "="
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                        scope.$apply(function () {
                            scope.fileread = loadEvent.target.result;
                        });
                    }
                    reader.readAsDataURL(changeEvent.target.files[0]);
                });
            }
        }
    }]);
app.directive('onlyDigitsColon', function (AppVal) {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function (val) {
                if (angular.isUndefined(val)) {
                    var val = '';
                }
                var clean = val.replace(/[^-0-9\:]/g, '');
                var negativeCheck = clean.split('-');
                var decimalCheck = clean.split(':');
                if (!angular.isUndefined(negativeCheck[1])) {
                    negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                    clean = negativeCheck[0] + '-' + negativeCheck[1];
                    if (negativeCheck[0].length > 0) {
                        clean = negativeCheck[0];
                    }

                }

                if (!angular.isUndefined(decimalCheck[1])) {
                    decimalCheck[1] = decimalCheck[1].slice(0, AppVal.decimalPlaces_UnitPrice);
                    clean = decimalCheck[0] + ':' + decimalCheck[1];
                }

                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });

            element.bind('keypress', function (event) {
                if (event.keyCode === 32 || event.keyCode === 45) {
                    event.preventDefault();
                }
            });
        }
    };
});
app.directive('onlyDigits5', function (AppVal) {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function (val) {
                if (angular.isUndefined(val)) {
                    var val = '';
                }
                var clean = val.replace(/[^-0-9\.]/g, '');
                var negativeCheck = clean.split('-');
                var decimalCheck = clean.split('.');
                if (!angular.isUndefined(negativeCheck[1])) {
                    negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                    clean = negativeCheck[0] + '-' + negativeCheck[1];
                    if (negativeCheck[0].length > 0) {
                        clean = negativeCheck[0];
                    }

                }

                if (!angular.isUndefined(decimalCheck[1])) {
                    decimalCheck[1] = decimalCheck[1].slice(0, AppVal.decimalPlaces);
                    clean = decimalCheck[0] + '.' + decimalCheck[1];
                }

                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });
            element.bind('keypress', function (event) {
                if (event.keyCode === 32 || event.keyCode === 45) {
                    event.preventDefault();
                }
            });
        }
    };
});
app.filter('numberformatter', function () {
    return function (numericvalue, showmils, decimalplaces, FLAG) {
        if (FLAG == 1) {

        }
        var output = 0
        if (numericvalue != undefined) {
            if (showmils) {
                const formatter = Intl.NumberFormat("en", {

                    notation: "compact",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                });
                if (parseFloat(numericvalue) < 0) {
                    numericvalue = numericvalue * -1;
                    output = '(' + formatter.format(numericvalue) + ')';
                    output = output.replace(/K/g, "k");
                }
                else {
                    output = formatter.format(numericvalue);
                    output = output.replace(/K/g, "k");
                }
            }
            else {
                const formatter = Intl.NumberFormat("en-us", { notation: "standard" });
                if (parseFloat(numericvalue) < 0) {
                    numericvalue = numericvalue * -1;
                    output = '(' + formatter.format(parseFloat(numericvalue).toFixed(decimalplaces)) + ')';
                }
                else {
                    output = formatter.format(parseFloat(numericvalue).toFixed(decimalplaces));
                }
            }
        }
        return output;
    };
});
app.directive('onlyNumberWithDecimal', function (AppVal) {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }
            ngModelCtrl.$parsers.push(function (val) {
                if (angular.isUndefined(val)) {
                    var val = '0';
                }
                var clean = val.replace(/[^-0-9\.]/g, '');
                var negativeCheck = clean.split('-');
                var decimalCheck = clean.split('.');
                if (!angular.isUndefined(negativeCheck[1])) {
                    negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                    clean = negativeCheck[0] + '-' + negativeCheck[1];
                    if (negativeCheck[0].length > 0) {
                        clean = negativeCheck[0];
                    }

                }

                if (!angular.isUndefined(decimalCheck[1])) {
                    decimalCheck[1] = decimalCheck[1].slice(0, AppVal.decimalPlaces);
                    clean = decimalCheck[0] + '.' + decimalCheck[1];
                }

                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                else {
                    if (clean.length == 10) {
                        clean = clean + '.00000';
                        ngModelCtrl.$setViewValue(clean);
                        ngModelCtrl.$render();
                    }
                    if (clean.length == 0) {
                        clean = 0 + '.00000';
                        ngModelCtrl.$setViewValue(clean);
                        ngModelCtrl.$render();
                    }

                }
                return clean;
            });
            element.bind('keypress', function (event) {
                if (event.keyCode === 32 || event.keyCode === 45) {
                    event.preventDefault();
                }
            });
        }
    };
});
$('.NumberWithDecimal').keypress(function (evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31
        && (charCode < 48 || charCode > 57))
        return false;

    return true;
});
app.directive('fileReaderDirective', function () {
    return {
        restrict: "A",
        scope: {
            fileReaderDirective: "=",
        },
        link: function (scope, element) {
            $(element).on('change', function (changeEvent) {
                var files = changeEvent.target.files;
                if (files.length) {
                    var r = new FileReader();
                    r.onload = function (e) {
                        var contents = e.target.result;
                        scope.$apply(function () {
                            scope.fileReaderDirective = contents;
                        });
                    };
                    r.readAsText(files[0]);
                }
            });
        }
    };
});
app.factory('readFileData', function () {
    return {
        processData: function (csv_data, Splitter) {
            var record = csv_data.split(/\r\n|\n/);
            var headers = record[0].split(Splitter);
            var lines = [];
            var json = {};

            for (var i = 0; i < record.length; i++) {
                var data = record[i].split(',');
                if (data.length == headers.length) {
                    var tarr = [];
                    for (var j = 0; j < headers.length; j++) {
                        tarr.push(data[j]);
                    }
                    lines.push(tarr);
                }
            }

            for (var k = 0; k < lines.length; ++k) {
                json[k] = lines[k];
            }
            return json;
        }
    };
});
app.factory('readFileDataNew', function () {
    return {
        processData: function (csv_data, Splitter) {
            var record = csv_data.split(/\r\n|\n/);
            //var headers = record[0].split(Splitter);
            //var lines = [];
            //var json = {};
            //for (var i = 0; i < record.length; i++) {
            //    var data = record[i].split(',');
            //    if (data.length == headers.length) {
            //        var tarr = [];
            //        for (var j = 0; j < headers.length; j++) {
            //            tarr.push(data[j]);
            //        }
            //        lines.push(tarr);
            //    }
            //}

            //for (var k = 0; k < lines.length; ++k) {
            //    json[k] = lines[k];
            //}
            // var sample = "[a, b, c, \"d, e, f\", g, h]";
            var items = []
            for (var j = 0; j < record.length; j++) {
                var inQuotes = false, currentItem = '';
                var sample = record[j];
                var arr = sample.match(/^[\"\[\]\,\s]$/gi);
                if (arr.length > 0) {
                    console.log(arr);
                }
                for (var i = 0; i < sample.length; i++) {
                    if (sample[i] == '"') {
                        inQuotes = !inQuotes;
                        if (!inQuotes) {
                            if (currentItem.length) items.push(currentItem);
                            currentItem = '';
                        }
                        continue;
                    }
                    if ((/^[\"\[\]\,\s]$/gi).test(sample[i]) && !inQuotes) {
                        if (currentItem.length) items.push(currentItem);
                        currentItem = '';
                        continue;
                    }
                    currentItem += sample[i];
                }
                if (currentItem.length) items.push(currentItem);
            }
            return items;
        }
    };
});

app.directive('onlyPlusMinus', function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function (val) {
                if (angular.isUndefined(val)) {
                    var val = '';
                }
                var clean = val.replace(/[^-0-9\.]/g, '');
                var negativeCheck = clean.split('-');
                var decimalCheck = clean.split('.');
                if (!angular.isUndefined(negativeCheck[2])) {
                    //clean = "";
                    //negativeCheck[1] = negativeCheck[1].slice(0, 2);
                    clean = negativeCheck[0] + '' + negativeCheck[1];
                }
                if (!angular.isUndefined(decimalCheck[1])) {
                    decimalCheck[1] = decimalCheck[1].slice(0, 2);
                    clean = decimalCheck[0] + '.' + decimalCheck[1];
                }

                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });

            element.bind('keypress', function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
});
app.directive('onlyPositiveDigits', function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function (val) {
                if (angular.isUndefined(val)) {
                    var val = '';
                }
                var clean = val.replace(/[^-0-9\.]/g, '');
                var negativeCheck = clean.split('-');
                var decimalCheck = clean.split('.');
                if (!angular.isUndefined(negativeCheck[1])) {
                    clean = "";
                }
                if (!angular.isUndefined(decimalCheck[1])) {
                    decimalCheck[1] = decimalCheck[1].slice(0, 2);
                    clean = decimalCheck[0] + '.' + decimalCheck[1];
                }

                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });

            element.bind('keypress', function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
});
//numbers - only
app.directive('onlyNumbers', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return '';
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
app.directive('onlyPhone', function () {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs, ctrl) {
            elm.on('keydown', function (event) {
                if (event.which == 64) {
                    // to allow numbers
                    return false;
                } else if (event.which == 187 || event.which == 189 || event.which == 46) {
                    // to allow plus
                    return true;
                } else if (event.which >= 48 && event.which <= 57) {
                    // to allow numbers
                    return true;
                } else if (event.which >= 96 && event.which <= 105) {
                    // to allow numpad number
                    return true;
                } else if ([8, 13, 27, 37, 38, 39, 40].indexOf(event.which) > -1) {
                    // to allow backspace, enter, escape, arrows
                    return true;
                } else {
                    event.preventDefault();
                    // to stop others
                    return false;
                }
            });
        }
    }
});

app.directive("onlyAlfa", function () {
    return {
        restrict: 'A',
        require: "ngModel",
        link: function (scope, elem, attrs, modelCtrl) {
            scope.$watch(function () {
                modelCtrl.$parsers.push(function (inputValue) {
                    var transformedInput = inputValue.replace(/[^a-zA-Z0-9]/g, '');
                    if (transformedInput !== inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }

                    return transformedInput;
                });
            });
        }
    };
});
app.directive('onlyLetters', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                var transformedInput = text.replace(/[^a-zA-Z]*$/g, '');
                //console.log(transformedInput);
                if (transformedInput !== text) {
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                }
                return transformedInput;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
app.directive('timer', function ($timeout, $compile) {
    return {
        restrict: 'E',
        scope: {
            interval: '=', //don't need to write word again, if property name matches HTML attribute name
            startTimeAttr: '=?startTime', //a question mark makes it optional
            countdownAttr: '=?countdown', //what unit?
            ListAttr: '=?list' //what unit?
        },
        template: '<div data-ng-show="minutes==0 && seconds >= 1"' +
            '><p>' +
            '<p >Time ends in : ' +
            //' hour<span >s</span>, ' +
            '{{ minutes }} minutes, ' +
            '{{ seconds }} seconds ' +
            //'<span data-ng-if="millis">, milliseconds: {{millis}}</span>'+
            '</p>' +
            //'<p>Interval ID: {{ intervalId  }}<br>' +
            //'Start Time: {{ startTime | date:"mediumTime" }}<br>' +
            //'Stopped Time: {{ stoppedTime || "Not stopped" }}</p>' +

            '</p>',
        //'<button data-ng-click="SUPPLIER_DOC_REMOVE(scope.ListAttr)" >Delete</button>',
        //'<button data-ng-click="stop()" data-ng-disabled="stoppedTime">Stop</button>',

        link: function (scope, elem, attrs) {
            //Properties
            scope.startTime = scope.startTimeAttr ? new Date(scope.startTimeAttr) : new Date();
            var countdown = (scope.countdownAttr && parseInt(scope.countdownAttr, 10) > 0) ? parseInt(scope.countdownAttr, 10) : 0; //defaults to 60 seconds
            function tick() {
                //How many milliseconds have passed: current time - start time
                scope.millis = new Date() - scope.startTime;
                if (countdown > 0) {
                    scope.ListAttr.stopdetele = true;
                    scope.millis = countdown * 1000;
                    countdown--;
                } else if (countdown <= 0) {
                    console.log('Your time is up!');
                    scope.seconds = Math.floor((scope.millis / 1000) % 60);
                    scope.minutes = Math.floor(((scope.millis / (1000 * 60)) % 60));
                    scope.hours = Math.floor(((scope.millis / (1000 * 60 * 60)) % 24));
                    scope.days = Math.floor(((scope.millis / (1000 * 60 * 60)) / 24));
                    scope.seconds = 0
                    scope.minutes = 0
                    scope.hours = 0
                    scope.days = 0
                    scope.ListAttr.stopdetele = false;
                    scope.stop();
                    scope.$apply();
                    return;
                }
                scope.seconds = Math.floor((scope.millis / 1000) % 60);
                scope.minutes = Math.floor(((scope.millis / (1000 * 60)) % 60));
                scope.hours = Math.floor(((scope.millis / (1000 * 60 * 60)) % 24));
                scope.days = Math.floor(((scope.millis / (1000 * 60 * 60)) / 24));
                //is this necessary? is there another piece of unposted code using this?
                scope.$emit('timer-tick', {
                    intervalId: scope.intervalId,
                    millis: scope.millis
                });
                scope.$apply();
            }
            function resetInterval() {
                if (scope.intervalId) {
                    clearInterval(scope.intervalId);
                    scope.intervalId = null;
                }
            }
            scope.stop = function () {
                scope.stoppedTime = new Date();
                resetInterval();
            }
            //if not used anywhere, make it a regular function so you don't pollute the scope
            function start() {
                resetInterval();
                scope.intervalId = setInterval(tick, scope.interval);
            }

            scope.resume = function () {
                scope.stoppedTime = null;
                scope.startTime = new Date() - (scope.stoppedTime - scope.startTime);
                start();
            }

            start(); //start timer automatically

            //Watches
            scope.$on('time-start', function () {
                start();
            });

            scope.$on('timer-resume', function () {
                scope.resume();
            });

            scope.$on('timer-stop', function () {
                scope.stop();
            });

            //Cleanup
            elem.on('$destroy', function () {
                resetInterval();
            });

        }
    };
});
app.directive('formattedDecimal', function ($filter) {
    return {
        link: function (scope, element, attrs, ctrl) {
            ctrl.$formatters.unshift(function (modelValue) {
                return $filter('number')(modelValue, 2);
            });
            ctrl.$parsers.unshift(function (viewValue) {
                var val = viewValue;
                var digits = 0;
                if (val) {
                    digits = val.replace(/[^0-9.]/g, '');
                    if (digits.split('.').length > 2) {
                        digits = digits.substring(0, digits.length - 1);
                    }
                    if (digits !== val) {
                        ctrl.$setViewValue(digits);
                        ctrl.$render();
                    }
                }
                return digits;
            });
        },
        restrict: 'A',
        require: 'ngModel'
    }
});
app.directive('formatDecimal', function ($filter, AppVal) {
    return {
        link: function (scope, element, attrs, ctrl) {
            ctrl.$formatters.unshift(function (modelValue) {

                return parseFloat(modelValue == null ? 0 : modelValue).toFixed(AppVal.decimalPlaces_UnitPrice);
            });
        },
        restrict: 'A',
        require: 'ngModel'
    }
});
app.directive('formatDecimal5', function ($filter, AppVal) {
    return {
        link: function (scope, element, attrs, ctrl) {
            ctrl.$formatters.unshift(function (modelValue) {
                return parseFloat(modelValue == null ? 0 : modelValue).toFixed(AppVal.decimalPlaces);
            });
        },
        restrict: 'A',
        require: 'ngModel'
    }
});
app.directive('whenScrolledDiv', function () {
    return function (scope, elm, attr) {
        var raw = elm[0];
        elm.bind('scroll', function () {
            //console.log("raw.scrollTop = " + raw.scrollTop);
            //console.log("raw.offsetHeight = " + raw.offsetHeight);
            //console.log("raw.scrollHeight = " + raw.scrollHeight);
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                scope.$apply(attr.whenScrolledDiv);
            }
        });
    };
});
app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter, { 'event': event });
                });

                event.preventDefault();
            }
        });
    };
});
//app.directive('whenScrolled', function ($window) {
//    return function (scope, elm, attr) {
//        var top = angular.element($window)[0].screenTop;
//        var origHeight = angular.element($window)[0].screen.height;
//        var height = (origHeight * 0.9);
//        angular.element($window).bind('scroll', function () {
//            var windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
//            var body = document.body, html = document.documentElement;
//            var docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
//            windowBottom = windowHeight + window.pageYOffset;
//            //console.log("windowBottom=" + windowBottom + "     docHeight=" + docHeight)
//            if (windowBottom >= docHeight) {
//                scope.$apply(attr.whenScrolled);
//            }
//            //in case of any problem with the lazy LOad and bottom scroll then try "ctrl+0"
//        });

//    };
//});
app.directive('templateurl', function () {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            //some ode
        },
        templateUrl: function (elem, attrs) {
            return attrs.templateUrl || 'some/path/default.html'
        }
    }
});
app.filter('unique', function () {
    return function (collection, keyname) {
        var output = [],
            keys = [];

        angular.forEach(collection, function (item) {
            var key = item[keyname];
            if (keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
            }
        });
        return output;
    };
});
//total function for calculating the total of any column in Json
//app.filter('nospace', function () {
//    return function (value) {
//        return (!value) ? '' : value.replace(/ /g, '');
//    };
//});
app.directive('noSpaces', function () {
    return {
        restrict: 'A',

        link: function ($scope, $element) {
            $element.bind('keydown', function (e) {
                if (e.which === 32) {
                    e.preventDefault();
                }
            });
        }
    }
});


app.filter('total', function () {
    return function (input, property) {
        var total = 0;
        if (input != undefined) {
            var i = input.length;
            while (i--)
                total += (input[i][property]) * 1;
        }
        return total;
    }
});
app.filter('totalFloat', function () {
    return function (input, property) {
        var total = 0;
        if (input != undefined) {
            var i = input.length;
            while (i--)
                total += parseFloat(((input[i][property]).replace(',', ''))) * 1;
        }
        return total;
    }
});
app.filter('groupBy', function () {
    return function (collection, key) {
        if (collection === null) return;
        return uniqueItems(collection, key);
    };
});
app.filter('trustAsHtml', function ($sce) {
    return function (html) {
        return $sce.trustAsHtml(html);
    };
});
app.filter('count', function () {
    return function (collection, key) {
        var out = "test";
        for (var i = 0; i < collection.length; i++) {
            //console.log(collection[i].pants);
            //var out = myApp.filter('filter')(collection[i].pants, "42", true);
        }
        return out;
    }
});
app.filter('replace', [function () {
    return function (input, from, to) {
        if (input === undefined) {
            return;
        }
        var regex = new RegExp(from, 'g');
        return input.replace(regex, to);
    };
}]);
app.filter('thousandSuffix', function () {
    return function (input, decimals) {
        var exp, rounded,
            suffixes = ['k', 'M', 'G', 'T', 'P', 'E'];

        if (window.isNaN(input)) {
            return null;
        }

        if (input < 1000) {
            exp = Math.floor(input / 1000);
            return Math.round((input / Math.pow(1000, 1))) + 'k';
        }
        else {

            exp = Math.floor(Math.log(input) / Math.log(1000));
            //return (input / Math.pow(1000, exp)).toFixed(decimals) + suffixes[exp - 2];
            return Math.round((input / Math.pow(1000, 1))) + 'k';
        }
    };
});
app.filter('round', function () {
    return function (input) {
        return Math.round(input);
    };
});
app.directive('preventDoubleClick', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function (e) {
                if (element.prop('disabled')) {
                    e.preventDefault();
                } else {
                    element.prop('disabled', true);
                    setTimeout(() => {
                        element.prop('disabled', false);
                    }, attrs.preventDoubleClick || 1000); // Use attribute value or default 1s
                }
            });
        }
    };
});
app.directive('whenScrolled', function () {
    return function (scope, elm, attr) {
        var raw = elm[0];
        elm.bind('scroll', function () {
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                // scope.$apply(attr.whenScrolled);
                alert(attr.whenScrolled);
            }
        });
    };
});

//app.directive(
//           "bnDocumentClick",
//           function ($document, $parse) {
//               // I connect the Angular context to the DOM events.
//               var linkFunction = function ($scope, $element, $attributes) {
//                   // Get the expression we want to evaluate on the
//                   // scope when the document is clicked.
//                   var scopeExpression = $attributes.bnDocumentClick;
//                   // Compile the scope expression so that we can
//                   // explicitly invoke it with a map of local
//                   // variables. We need this to pass-through the
//                   // click event.
//                   //
//                   // NOTE: I ** think ** this is similar to
//                   // JavaScript's apply() method, except using a
//                   // set of named variables instead of an array.
//                   var invoker = $parse(scopeExpression);
//                   // Bind to the document click event.
//                   $document.on(
//                       "click",
//                       function (event) {
//                           // When the click event is fired, we need
//                           // to invoke the AngularJS context again.
//                           // As such, let's use the $apply() to make
//                           // sure the $digest() method is called
//                           // behind the scenes.
//                           $scope.$apply(
//                               function () {
//                                   // Invoke the handler on the scope,
//                                   // mapping the jQuery event to the
//                                   // $event object.
//                                   invoker(
//                                       $scope,
//                                       {
//                                           $event: event
//                                       }
//                                   );
//                               }
//                           );
//                       }
//                   );
//                   // TODO: Listen for "$destroy" event to remove
//                   // the event binding when the parent controller
//                   // is removed from the rendered document.
//               };
//               // Return the linking function.
//               return (linkFunction);
//           });
app.value("AppVal", {
    GridPageSize: 20,
    decimalPlaces: 5,
    decimalPlaces2: 2,
    decimalPlaces_Quantity: 2,
    decimalPlaces_UnitPrice: 2,
    decimalPlaces_TotalPrice: 2,
    sbMin: 0,
    sbMax: 9999999999,
    sbPrecision: 2,
    sbMaxPrecision: 2,
    FileSize: 5,
    CONTRACT_MODULE: {
        MODULE_ID: 8,
        SUB_MODULE_ID: 0,
    },
    RFI_MODULE: {
        MODULE_ID: 8,
        SUB_MODULE_ID: 0,
    },
    MMMMddyyyy: "MMM dd, yyyy"
});
app.factory('Excel', function ($window) {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="https://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function (s) { return $window.btoa(unescape(encodeURIComponent(s))); },
        format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };
    return {
        tableToExcel: function (tableId, worksheetName) {
            var table = $(tableId),
                ctx = { worksheet: worksheetName, table: table.html() },
                href = uri + base64(format(template, ctx));
            return href;
        }
    };
})
app.service('ConfigurationService', function ($http, $localStorage, $filter) {
    this.GetAccess = function GetAccess(Location_ID, Configuration_ID) {
        var LCache = JSON.parse($localStorage.LCache);
        var LOCATIONID = parseInt(Location_ID);
        var FilterdCache = $filter('filter')(LCache, { Location_ID: LOCATIONID, Configuration_ID: Configuration_ID }, true);
        return FilterdCache[0];
    };
    this.GetModuleAccess = function GetModuleAccess(MCache, MODULE_ID) {
        // var LCache = JSON.parse($localStorage.LCache);
        var FilterdCache = $filter('filter')(MCache, { MODULE_ID: MODULE_ID }, true);
        return FilterdCache.length == 0 ? false : FilterdCache[0].SWITCH == 1 ? true : false;
    };
    this.GetCustomerModuleAccess = function GetModuleAccess(MODULE_ID) {
        var MCache = JSON.parse($localStorage.MCache);
        var FilterdCache = $filter('filter')(MCache, { Module_ID: MODULE_ID }, true);
        return FilterdCache.length == 0 ? false : FilterdCache[0].IsEnable;
    };
    this.GetCCacheAccess = function GetCCacheAccess(Configuration_ID) {
        var CCache = JSON.parse($localStorage.CCache);
        var FilterdCache = $filter('filter')(CCache, { Configuration_ID: Configuration_ID }, true);
        return FilterdCache.length == 0 ? false : FilterdCache[0].IsEnable;
    };
});
app.service('CheckRole', function ($http, $localStorage, $filter) {
    this.GetAccess = function GetAccess(ROLE_ID, Location_ID) {
        var USERLOCATIONROLE = JSON.parse($localStorage.ULR);
        var FilterdRole = Location_ID == 0 ? $filter('filter')(USERLOCATIONROLE, { ROLE_ID: ROLE_ID }, true) : $filter('filter')(USERLOCATIONROLE, { LOCATION_ID: Location_ID, ROLE_ID: ROLE_ID }, true);
        return FilterdRole.length > 0 ? true : false;
    };

});
/////////////////////////return to top///////////////////////////////////////////
$(window).scroll(function () {
    var header = document.getElementById("myHeader");
    // var header12 = document.getElementById("myHeader12");
    // alert($(this).scrollTop())
    var scrollvalue = $(this).scrollTop();
    if ($(this).scrollTop() >= 50) {
        // If page is scrolled more than 50px
        $('#return-to-top').fadeIn(200);
        $('#return-to-back').fadeIn(200);
        if (header != null) {
            header.classList.add("sticky");
        }
        // Fade in the arrow
        //if (header12 != null) {
        //    header12.classList.add("sticky");// Fade in the arrow
        //    header12.classList.add("stickylandingPage");// Fade in the arrow
        //}
    } else {
        $('#return-to-top').fadeOut(200);
        $('#return-to-back').fadeOut(200);
        if (header != null) {
            header.classList.remove("sticky");
        }
        //if (header12 != null) {
        //    header12.classList.remove("sticky");
        //    header12.classList.remove("stickylandingPage");
        //}
    }
});
$('#return-to-top').click(function () {      // When arrow is clicked
    $('body,html').animate({
        scrollTop: 0                       // Scroll to top of body
    }, 500);
});
$('#return-to-back').click(function () {      // When arrow is clicked
    window.history.back();
});
$('#return-to-top_Page').click(function () {

    $('body,html').animate({
        scrollTop: 0                       // Scroll to top of body
    }, 500);
});
///////////////////////////////////////////////////////////////////
app.directive('sbPrecision', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attributes, ngModel) {
            var precision = attributes.sbPrecision;

            function setPrecision() {
                var value = ngModel.$modelValue;

                //since this is just a mask, don't hide decimal values that
                //go beyond our precision and don't format empty values
                if (value && !isNaN(value) && countDecimalPlaces(value) <= precision) {
                    var formatted = Number(value).toFixed(precision);
                    ngModel.$viewValue = formatted;
                    ngModel.$render();
                }
            }

            element.bind('blur', setPrecision);
            setTimeout(setPrecision, 0); //after initial page render
        }

    };
})
app.directive('sbMin', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attributes, ngModel) {

            function minimum(value) {
                if (!isNaN(value)) {
                    var validity = Number(value) >= attributes.sbMin;
                    ngModel.$setValidity('min-value', validity)
                }
                return value;
            }

            ngModel.$parsers.push(minimum);
            ngModel.$formatters.push(minimum);
        }

    };
})
app.directive('sbMax', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attributes, ngModel) {


            function maximum(value) {
                if (!isNaN(value)) {
                    var validity = Number(value) <= attributes.sbMax;
                    ngModel.$setValidity('max-value', validity);
                }

                return value;
            }

            ngModel.$parsers.push(maximum);
            ngModel.$formatters.push(maximum);
        }

    };
})

app.directive('angucomplete', function ($parse, $http, $sce, $timeout) {
    return {
        restrict: 'EA',
        scope: {
            "id": "@id",
            "placeholder": "@placeholder",
            "selectedObject": "=selectedobject",
            "url": "@url",
            "dataField": "@datafield",
            "titleField": "@titlefield",
            "NoField": "@NoField",
            "descriptionField": "@descriptionfield",
            "imageField": "@imagefield",
            "imageUri": "@imageuri",
            "inputClass": "@inputclass",
            "userPause": "@pause",
            "localData": "=localdata",
            "searchFields": "@searchfields",
            "minLengthUser": "@minlength",
            "matchClass": "@matchclass"
        },
        template: '<div class="angucomplete-holder"><input id="{{id}}_value" ng-model="searchStr" type="text" placeholder="{{placeholder}}" class="{{inputClass}} form-control-sm" onmouseup="this.select();" ng-focus="resetHideResults()" ng-blur="hideResults()"  autocomplete="off"/><div id="{{id}}_dropdown" class="angucomplete-dropdown dropdown-menu-right text-sm client-scrollbar scrollbar-wrapper" ng-show="showDropdown"><div class="angucomplete-searching" ng-show="searching">Searching...</div><div class="angucomplete-searching" ng-show="!searching && (!results || results.length == 0)">No results found</div><div class="angucomplete-row align-items-center employee-search-border" ng-repeat="result in results" ng-click="SELECT_EMP_RESULT(result)" ng-mousedown="selectResult(result)" ng-mouseover="hoverRow()"  ng-class="{\'angucomplete-selected-row\': $index == currentIndex}"><div class="d-flex"><div ng-if="imageField" class="angucomplete-image-holder img-36"><img ng-if="result.image && result.image != \'\'" ng-src="{{result.image}}" class="angucomplete-image "/><div ng-if="!result.image && result.image != \'\'" class="angucomplete-image-default"></div></div><div class="angucomplete-title employee-name-limit mt-2" ng-if="matchClass" ng-bind-html="result.title"></div><div class="angucomplete-title" ng-if="!matchClass">{{ result.title }}</div><div ng-if="result.description && result.description != \'\'" class="angucomplete-description">{{result.description}}</div></div></div></div></div>',

        link: function ($scope, elem, attr) {
            $scope.lastSearchTerm = null;
            $scope.currentIndex = null;
            $scope.justChanged = false;
            $scope.searchTimer = null;
            $scope.hideTimer = null;
            $scope.searching = false;
            $scope.pause = 500;
            $scope.minLength = 3;
            $scope.searchStr = null;

            if ($scope.minLengthUser && $scope.minLengthUser != "") {
                $scope.minLength = $scope.minLengthUser;
            }

            if ($scope.userPause) {
                $scope.pause = $scope.userPause;
            }

            isNewSearchNeeded = function (newTerm, oldTerm) {
                return newTerm.length >= $scope.minLength && newTerm != oldTerm
            }

            $scope.processResults = function (responseData, str) {
                if (responseData && responseData.length > 0) {
                    $scope.results = [];

                    var titleFields = [];
                    if ($scope.titleField && $scope.titleField != "") {
                        titleFields = $scope.titleField.split(",");
                    }

                    for (var i = 0; i < responseData.length; i++) {
                        // Get title variables
                        var titleCode = [];

                        for (var t = 0; t < titleFields.length; t++) {
                            titleCode.push(responseData[i][titleFields[t]]);
                        }

                        var description = "";
                        if ($scope.descriptionField) {
                            description = responseData[i][$scope.descriptionField];
                        }

                        var imageUri = "";
                        if ($scope.imageUri) {
                            imageUri = $scope.imageUri;
                        }

                        var image = "";
                        if ($scope.imageField) {
                            image = imageUri + responseData[i][$scope.imageField];
                        }

                        var text = titleCode.join(' ');
                        if ($scope.matchClass) {
                            var re = new RegExp(str, 'i');
                            var strPart = text.match(re)[0];
                            text = $sce.trustAsHtml(text.replace(re, '<span class="' + $scope.matchClass + '">' + strPart + '</span>'));
                        }

                        var resultRow = {
                            title: text,
                            description: description,
                            image: image,
                            originalObject: responseData[i]
                        }

                        $scope.results[$scope.results.length] = resultRow;
                    }


                } else {
                    $scope.results = [];
                }
            }

            $scope.searchTimerComplete = function (str) {
                // Begin the search

                if (str.length >= $scope.minLength) {
                    if ($scope.localData) {
                        var searchFields = $scope.searchFields.split(",");

                        var matches = [];

                        for (var i = 0; i < $scope.localData.length; i++) {
                            var match = false;

                            for (var s = 0; s < searchFields.length; s++) {
                                match = match || (typeof $scope.localData[i][searchFields[s]] === 'string' && typeof str === 'string' && $scope.localData[i][searchFields[s]].toLowerCase().indexOf(str.toLowerCase()) >= 0);
                            }

                            if (match) {
                                matches[matches.length] = $scope.localData[i];
                            }
                        }

                        $scope.searching = false;
                        $scope.processResults(matches, str);

                    } else {
                        $http.get($scope.url + str, {}).
                            success(function (responseData, status, headers, config) {
                                $scope.searching = false;
                                $scope.processResults((($scope.dataField) ? responseData[$scope.dataField] : responseData), str);
                            }).
                            error(function (data, status, headers, config) {
                                console.log("error");
                            });
                    }
                }
            }

            $scope.hideResults = function () {
                $scope.hideTimer = $timeout(function () {
                    $scope.showDropdown = false;
                }, $scope.pause);
            };

            $scope.resetHideResults = function () {
                if ($scope.hideTimer) {
                    $timeout.cancel($scope.hideTimer);
                };
            };

            $scope.hoverRow = function (index) {
                $scope.currentIndex = index;
            }

            $scope.keyPressed = function (event) {
                if (!(event.which == 38 || event.which == 40 || event.which == 13)) {
                    if (!$scope.searchStr || $scope.searchStr == "") {
                        $scope.showDropdown = false;
                        $scope.lastSearchTerm = null
                        $scope.selectedObject = null;

                    } else if (isNewSearchNeeded($scope.searchStr, $scope.lastSearchTerm)) {
                        $scope.lastSearchTerm = $scope.searchStr
                        $scope.showDropdown = true;
                        $scope.currentIndex = -1;
                        $scope.results = [];

                        if ($scope.searchTimer) {
                            $timeout.cancel($scope.searchTimer);
                        }

                        $scope.searching = true;

                        $scope.searchTimer = $timeout(function () {
                            $scope.searchTimerComplete($scope.searchStr);
                        }, $scope.pause);
                    }
                } else {
                    event.preventDefault();
                }
            }


            $scope.selectResult = function (result) {
                if ($scope.matchClass) {
                    result.title = result.title.toString().replace(/(<([^>]+)>)/ig, '');
                }
                $scope.searchStr = $scope.lastSearchTerm = result.title;
                $scope.selectedObject = result;
                $scope.showDropdown = false;
                $scope.results = [];

                if ($scope.selectedObject !== null && $scope.selectedObject !== undefined && $scope.selectedObject.originalObject !== undefined) {
                    if ($scope.selectedObject.originalObject.STEP_NO == 9) {
                        window.location.href = '../Hr/HrIndex#!/PrimaryDetails?STEP_NO=' + $scope.selectedObject.originalObject.STEP_NO + '&EMP_ID=' + $scope.selectedObject.originalObject.EMPLY_PRSNL_ID;
                        // $location.path('PrimaryDetails').search('EMP_ID', $scope.selectedObject.originalObject.EMPLY_PRSNL_ID).search('STEP_NO', $scope.selectedObject.originalObject.STEP_NO);
                    }
                    else if ($scope.selectedObject.originalObject.STEP_NO < 9) {
                        $scope.RedirectiononEmp($scope.selectedObject.originalObject);
                    };
                }
                else {
                    $scope.$parent.ShowAlertBox('Warning', 'no result found ', 3000);
                }

                //$scope.$apply();
            }

            var inputField = elem.find('input');

            inputField.on('keyup', $scope.keyPressed);

            elem.on("keyup", function (event) {
                if (event.which === 40) {
                    if ($scope.results && ($scope.currentIndex + 1) < $scope.results.length) {
                        $scope.currentIndex++;
                        $scope.$apply();
                        event.preventDefault;
                        event.stopPropagation();
                    }

                    $scope.$apply();
                } else if (event.which == 38) {
                    if ($scope.currentIndex >= 1) {
                        $scope.currentIndex--;
                        $scope.$apply();
                        event.preventDefault;
                        event.stopPropagation();
                    }

                } else if (event.which == 13) {
                    if ($scope.results && $scope.currentIndex >= 0 && $scope.currentIndex < $scope.results.length) {
                        $scope.selectResult($scope.results[$scope.currentIndex]);
                        $scope.$apply();
                        event.preventDefault;
                        event.stopPropagation();
                    } else {
                        $scope.results = [];
                        $scope.$apply();
                        event.preventDefault;
                        event.stopPropagation();
                    }

                } else if (event.which == 27) {
                    $scope.results = [];
                    $scope.showDropdown = false;
                    $scope.$apply();
                } else if (event.which == 8) {
                    $scope.selectedObject = null;
                    $scope.$apply();
                }
            });
        }
    };
});
app.directive('angucompletehrm', function ($parse, $http, $sce, $timeout) {
    return {
        restrict: 'EA',
        scope: {
            "id": "@id",
            "placeholder": "@placeholder",
            "selectedObject": "=selectedobject",
            "url": "@url",
            "dataField": "@datafield",
            "titleField": "@titlefield",
            "NoField": "@NoField",
            "descriptionField": "@descriptionfield",
            "imageField": "@imagefield",
            "imageUri": "@imageuri",
            "inputClass": "@inputclass",
            "userPause": "@pause",
            "localData": "=localdata",
            "searchFields": "@searchfields",
            "minLengthUser": "@minlength",
            "matchClass": "@matchclass"
        },
        template: '<div class="angucomplete-holder"><input id="{{id}}_value" ng-model="searchStr" type="text" placeholder="{{placeholder}}" class="{{inputClass}} form-control-sm" onmouseup="this.select();" ng-focus="resetHideResults()" ng-blur="hideResults()"  autocomplete="off"/><div id="{{id}}_dropdown" class="angucomplete-dropdown dropdown-menu-right text-sm client-scrollbar scrollbar-wrapper" ng-show="showDropdown"><div class="angucomplete-searching" ng-show="searching">Searching...</div><div class="angucomplete-searching" ng-show="!searching && (!results || results.length == 0)">No results found</div><div class="angucomplete-row align-items-center employee-search-border" ng-repeat="result in results" ng-click="SELECT_EMP_RESULT(result)" ng-mousedown="selectResult(result)" ng-mouseover="hoverRow()"  ng-class="{\'angucomplete-selected-row\': $index == currentIndex}"><div class="d-flex"><div ng-if="imageField" class="angucomplete-image-holder img-36"><img ng-if="result.image && result.image != \'\'" ng-src="{{result.image}}" class="angucomplete-image "/><div ng-if="!result.image && result.image != \'\'" class="angucomplete-image-default"></div></div><div class="angucomplete-title employee-name-limit mt-2" ng-if="matchClass" ng-bind-html="result.title"></div><div class="angucomplete-title" ng-if="!matchClass">{{ result.title }}</div><div ng-if="result.description && result.description != \'\'" class="angucomplete-description">{{result.description}}</div></div></div></div></div>',

        link: function ($scope, elem, attr) {
            $scope.lastSearchTerm = null;
            $scope.currentIndex = null;
            $scope.justChanged = false;
            $scope.searchTimer = null;
            $scope.hideTimer = null;
            $scope.searching = false;
            $scope.pause = 500;
            $scope.minLength = 3;
            $scope.searchStr = null;

            if ($scope.minLengthUser && $scope.minLengthUser != "") {
                $scope.minLength = $scope.minLengthUser;
            }

            if ($scope.userPause) {
                $scope.pause = $scope.userPause;
            }

            isNewSearchNeeded = function (newTerm, oldTerm) {
                return newTerm.length >= $scope.minLength && newTerm != oldTerm
            }
            isNewSearchNeededKeypress = function (newTerm, oldTerm) {
                return newTerm.length >= $scope.minLength
            }
            $scope.processResults = function (responseData, str) {
                if (responseData && responseData.length > 0) {
                    $scope.results = [];

                    var titleFields = [];
                    if ($scope.titleField && $scope.titleField != "") {
                        titleFields = $scope.titleField.split(",");
                    }

                    for (var i = 0; i < responseData.length; i++) {
                        // Get title variables
                        var titleCode = [];

                        for (var t = 0; t < titleFields.length; t++) {
                            titleCode.push(responseData[i][titleFields[t]]);
                        }

                        var description = "";
                        if ($scope.descriptionField) {
                            description = responseData[i][$scope.descriptionField];
                        }

                        var imageUri = "";
                        if ($scope.imageUri) {
                            imageUri = $scope.imageUri;
                        }

                        var image = "";
                        if ($scope.imageField) {
                            image = imageUri + responseData[i][$scope.imageField];
                        }

                        var text = titleCode.join(' ');
                        if ($scope.matchClass) {
                            var re = new RegExp(str, 'i');
                            var strPart = text.match(re)[0];
                            text = $sce.trustAsHtml(text.replace(re, '<span class="' + $scope.matchClass + '">' + strPart + '</span>'));
                        }

                        var resultRow = {
                            title: text,
                            description: description,
                            image: image,
                            originalObject: responseData[i]
                        }

                        $scope.results[$scope.results.length] = resultRow;
                    }


                } else {
                    $scope.results = [];
                }
            }

            $scope.searchTimerComplete = function (str) {
                // Begin the search

                if (str.length >= $scope.minLength) {
                    if ($scope.localData) {
                        var searchFields = $scope.searchFields.split(",");

                        var matches = [];

                        for (var i = 0; i < $scope.localData.length; i++) {
                            var match = false;

                            for (var s = 0; s < searchFields.length; s++) {
                                match = match || (typeof $scope.localData[i][searchFields[s]] === 'string' && typeof str === 'string' && $scope.localData[i][searchFields[s]].toLowerCase().indexOf(str.toLowerCase()) >= 0);
                            }

                            if (match) {
                                matches[matches.length] = $scope.localData[i];
                            }
                        }

                        $scope.searching = false;
                        $scope.processResults(matches, str);

                    } else {
                        $http.get($scope.url + str, {}).
                            success(function (responseData, status, headers, config) {
                                $scope.searching = false;
                                $scope.processResults((($scope.dataField) ? responseData[$scope.dataField] : responseData), str);
                            }).
                            error(function (data, status, headers, config) {
                                console.log("error");
                            });
                    }
                }
            }

            //$scope.hideResults = function () {
            //    $scope.hideTimer = $timeout(function () {
            //        $scope.showDropdown = false;
            //    }, $scope.pause);
            //};

            $scope.resetHideResults = function () {
                if ($scope.hideTimer) {
                    $timeout.cancel($scope.hideTimer);
                };
            };

            $scope.hoverRow = function (index) {
                $scope.currentIndex = index;
            }

            $scope.keyPressed = function (event) {
                //|| event.which == 13
                if (!(event.which == 38 || event.which == 40)) {
                    if (!$scope.searchStr || $scope.searchStr == "") {
                        $scope.showDropdown = false;
                        $scope.lastSearchTerm = null
                        $scope.selectedObject = null;

                    } else if (isNewSearchNeeded($scope.searchStr, $scope.lastSearchTerm) && event.which != 13) {
                        $scope.lastSearchTerm = $scope.searchStr
                        $scope.showDropdown = true;
                        $scope.currentIndex = -1;
                        $scope.results = [];

                        if ($scope.searchTimer) {
                            $timeout.cancel($scope.searchTimer);
                        }

                        $scope.searching = true;

                        $scope.searchTimer = $timeout(function () {
                            $scope.searchTimerComplete($scope.searchStr);
                        }, $scope.pause);
                    }
                    else if (event.which == 13 && isNewSearchNeededKeypress($scope.searchStr, $scope.lastSearchTerm)) {
                        $scope.lastSearchTerm = $scope.searchStr
                        if ($scope.results.length == 1) {
                            $scope.selectedObject = $scope.results[0];
                            if ($scope.selectedObject !== null && $scope.selectedObject !== undefined && $scope.selectedObject.originalObject !== undefined) {
                                if ($scope.selectedObject.originalObject.STEP_NO == 9) {
                                    window.location.href = '../Hr/HrIndex#!/PrimaryDetails?STEP_NO=' + $scope.selectedObject.originalObject.STEP_NO + '&EMP_ID=' + $scope.selectedObject.originalObject.EMPLY_PRSNL_ID;
                                    // $location.path('PrimaryDetails').search('EMP_ID', $scope.selectedObject.originalObject.EMPLY_PRSNL_ID).search('STEP_NO', $scope.selectedObject.originalObject.STEP_NO);
                                }
                                else if ($scope.selectedObject.originalObject.STEP_NO < 9) {
                                    $scope.RedirectiononEmp($scope.selectedObject.originalObject);
                                };
                            }
                        }
                        else {
                            event.preventDefault();
                        }
                    }
                } else {
                    event.preventDefault();
                }
            }
            $scope.RedirectiononEmp = function (EMP) {
                if (EMP.STEP_NO == 1) {
                    window.location.href = '../Hr/HrIndex#!/PrimaryDetails?x=1&EMP_ID=' + EMP.EMPLY_PRSNL_ID;
                }
                if (EMP.STEP_NO == 2) {
                    window.location.href = '../Hr/HrIndex#!/EmploymentInfo?x=1&EMP_ID=' + EMP.EMPLY_PRSNL_ID;
                }
                if (EMP.STEP_NO == 3) {
                    window.location.href = '../Hr/HrIndex#!/Wages?x=1&EMP_ID=' + EMP.EMPLY_PRSNL_ID;
                }
                if (EMP.STEP_NO == 4) {
                    window.location.href = '../Hr/HrIndex#!/EmpAbsences?x=1&EMP_ID=' + EMP.EMPLY_PRSNL_ID;
                }
                if (EMP.STEP_NO == 5) {
                    window.location.href = '../Hr/HrIndex#!/EmpAccess?x=1&EMP_ID=' + EMP.EMPLY_PRSNL_ID;
                }
                if (EMP.STEP_NO == 6) {
                    window.location.href = '../Hr/HrIndex#!/Document?x=1&EMP_ID=' + EMP.EMPLY_PRSNL_ID;
                }
                if (EMP.STEP_NO == 7) {
                    window.location.href = '../Hr/HrIndex#!/Assets?x=1&EMP_ID=' + EMP.EMPLY_PRSNL_ID;
                }
                if (EMP.STEP_NO == 8) {
                    window.location.href = '../Hr/HrIndex#!/Qualificaiton?x=1&EMP_ID=' + EMP.EMPLY_PRSNL_ID;
                }
                if (EMP.STEP_NO == 8) {
                    window.location.href = '../Hr/HrIndex#!/Notes?x=1&EMP_ID=' + EMP.EMPLY_PRSNL_ID;
                }
            };
            $scope.selectResult = function (result, FLAG) {
                if ($scope.matchClass) {
                    result.title = result.title.toString().replace(/(<([^>]+)>)/ig, '');
                }
                $scope.searchStr = $scope.lastSearchTerm = result.title;
                $scope.selectedObject = result;
                $scope.showDropdown = false;
                $scope.results = [];
                if ($scope.selectedObject !== null && $scope.selectedObject !== undefined && $scope.selectedObject.originalObject !== undefined) {
                    if ($scope.selectedObject.originalObject.STEP_NO == 9) {
                        window.location.href = '../Hr/HrIndex#!/PrimaryDetails?STEP_NO=' + $scope.selectedObject.originalObject.STEP_NO + '&EMP_ID=' + $scope.selectedObject.originalObject.EMPLY_PRSNL_ID;
                        // $location.path('PrimaryDetails').search('EMP_ID', $scope.selectedObject.originalObject.EMPLY_PRSNL_ID).search('STEP_NO', $scope.selectedObject.originalObject.STEP_NO);
                    }
                    else if ($scope.selectedObject.originalObject.STEP_NO < 9) {
                        $scope.RedirectiononEmp($scope.selectedObject.originalObject);
                    };
                }
                else {
                    $scope.$parent.ShowAlertBox('Warning', 'no result found ', 3000);
                }

                //$scope.$apply();
            }

            var inputField = elem.find('input');

            inputField.on('keyup', $scope.keyPressed);

            elem.on("keyup", function (event) {
                if (event.which === 40) {
                    if ($scope.results && ($scope.currentIndex + 1) < $scope.results.length) {
                        $scope.currentIndex++;
                        $scope.$apply();
                        event.preventDefault;
                        event.stopPropagation();
                    }

                    $scope.$apply();
                } else if (event.which == 38) {
                    if ($scope.currentIndex >= 1) {
                        $scope.currentIndex--;
                        $scope.$apply();
                        event.preventDefault;
                        event.stopPropagation();
                    }

                } else if (event.which == 13) {
                    if ($scope.results && $scope.currentIndex >= 0 && $scope.currentIndex < $scope.results.length) {
                        //$scope.selectResult($scope.results[$scope.currentIndex]);
                        //$scope.$apply();
                        //event.preventDefault;
                        //event.stopPropagation();
                    } else {
                        $scope.results = [];
                        $scope.$apply();
                        event.preventDefault;
                        event.stopPropagation();
                    }

                } else if (event.which == 27) {
                    $scope.results = [];
                    $scope.showDropdown = false;
                    $scope.$apply();
                } else if (event.which == 8) {
                    $scope.selectedObject = null;
                    $scope.$apply();
                }
            });
        }
    };
});
var _dvMessage, _dvMessageHeading, _dvMessageContent;
function ConfirmModal(___title, message, yesCallback, noCallback, yesCaption, noCaption) {
    $('.___title').html(___title);
    $('.___msgBody').html(message);

    if (yesCaption != undefined) {
        $('#___btnYes').val(yesCaption);
    }
    if (noCaption != undefined) {
        $('#___btnNo').val(noCaption);
    }

    var dialog = $('#___modal_dialog');
    dialog.modal('show').off('shown.bs.modal').on('shown.bs.modal', function () {
        $('<div class="modal-backdrop fade in my" />').appendTo(document.body);
    }).off("hidden.bs.modal").on("hidden.bs.modal", function () {
        $(document.body).find('.modal-backdrop.fade.in.my').remove();
    });

    $('#___btnYes').off().on('click', function () {
        dialog.modal('hide');
        yesCallback();

    });
    $('#___btnNo').off().on('click', function () {
        dialog.modal('hide');
        noCallback();

    });
}