var app = angular.module('adminApp.controllers.product', ['adminApp.directive.product']);


app.controller('CategoryCtrl', function ($scope, $rootScope, $location) {
    $scope.category = {
        name: 'new category'
    };

});

app.controller('NewCategoryCtrl', function ($scope, $rootScope) {
    $scope.addNewCategory = function (formData) {
        var newItem = {
            id: 100,
            name: formData.name,
            selected: false,
            status: formData.desc,
            type: formData.type
        };
        console.log('formdata', formData);
//        $scope.items.push(newItem);

        $rootScope.$broadcast('item', newItem);

//        console.log('scope.items', $scope.items);
    };
});

app.controller('EditCategoryCtrl', function ($scope) {
    $scope.edit = '21szczx';
});


app.controller('TestCtrl', function ($scope) {
    $scope.content = 'Some desc about this project ...';
});


app.controller('ctrlRead', function ($scope, $rootScope, $filter, ProductCategoryTable) {

    // init
    $scope.sort = {
        sortingOrder: 'id',
        reverse: false
    };

    $scope.gap = 5;

    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 5;
    $scope.pagedItems = [];
    $scope.currentPage = 0;

    $scope.items = ProductCategoryTable.all();


    $scope.selectItem = function (index) {
        var itemChecked = $scope.items[index].selected;

        if (itemChecked == true) {
            $scope.items[index].selected = false;
        } else {
            $scope.items[index].selected = true;
        }
    };

    var searchMatch = function (haystack, needle) {
        if (!needle) {
            return true;
        }
        return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
    };


    $scope.deleteCategory = function () {
        $scope.items.splice(1,1);
        debugger;
    };





    // init the filtered items
    $scope.search = function () {

        $rootScope.$on('item', function(event, mass) { console.log(mass) });

        $scope.filteredItems = $filter('filter')($scope.items, function (item) {
            for (var attr in item) {
                if (searchMatch(item[attr], $scope.query))
                    return true;
            }
            return false;
        });
        // take care of the sorting order
        if ($scope.sort.sortingOrder !== '') {
            $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sort.sortingOrder, $scope.sort.reverse);
        }
        $scope.currentPage = 0;
        // now group by pages
        $scope.groupToPages();
    };


    // calculate page in place
    $scope.groupToPages = function () {
        $scope.pagedItems = [];

        for (var i = 0; i < $scope.filteredItems.length; i++) {
            if (i % $scope.itemsPerPage === 0) {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.filteredItems[i]];
            } else {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
            }
        }
    };

    $scope.range = function (size, start, end) {
        var ret = [];
        //        console.log(size, start, end);

        if (size < end) {
            end = size;
            start = size - $scope.gap;
        }
        for (var i = start; i < end; i++) {
            ret.push(i);
        }
        console.log(ret);
        return ret;
    };

    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };

    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.pagedItems.length - 1) {
            $scope.currentPage++;
        }
    };

    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };

    // functions have been describe process the data for display
    $scope.search();


});


app.$inject = ['$scope', '$filter'];