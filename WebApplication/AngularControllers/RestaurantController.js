app.controller('RestaurantListController', function ($scope, $http) {

 
});
app.controller('RestaurantEntryController', function ($scope, $http) {
    $(document).ready(function (n) {
        var max_fields = 5; //maximum input boxes allowed
        var wrapper = $(".input_fields_wrap"); //Fields wrapper
        var add_button = $(".add_field_button"); //Add button ID
        var x = 1; //initlal text box count
        $(add_button).click(function (e) { //on add input button click
            e.preventDefault();
            if (x < max_fields) { //max input box allowed
                x++; //text box increment
                var newDiv = ' <input type="text" id="Check" class="form-control m-1 input-sm "/>';
                $(wrapper).append(newDiv);
            }
        });
        $(document).on("click", ".delete", function (e) {
            e.preventDefault();
            $(this).parent('.deletable').remove();
            e.preventDefault();
            x--;
        });
    });
});