/**
* Code courtesy of https://gist.github.com/homerjam/aec5bb1c68a3bfb0ae95c1b83344a4cf
*/
angular.module('mdChipDraggable', [])
  .directive('mdChipDraggable', function () {
    return {
      restrict: 'A',
      scope: {},
      bindToController: true,
      controllerAs: 'vm',
      controller: ['$document', '$scope', '$element', '$timeout',
        function ($document, $scope, $element, $timeout) {
          var vm = this;

          var options = {
            axis: 'horizontal',
          };
          var handle = $element[0];
          var draggingClassName = 'dragging';
          var droppingClassName = 'dropping';
          var droppedClassName = 'dropped';
          var droppingBeforeClassName = 'dropping--before';
          var droppingAfterClassName = 'dropping--after';
          var dragging = false;
          var preventDrag = false;
          var dropPosition;
          var dropTimeout;

          var move = function (from, to) {
            // move the element in the chip array
            this.splice(to, 0, this.splice(from, 1)[0]);
          };

          // set the closest chip as the current element
          $element = angular.element($element[0].closest('md-chip'));

          $element.attr('draggable', true);

          $element.on('mousedown', function (event) {
            if (event.target !== handle) {
              preventDrag = true;
            }
          });

          $document.on('mouseup', function () {
            preventDrag = false;
          });

          $element.on('dragstart', function (event) {
            if (preventDrag) {
              event.preventDefault();

            } else {
              dragging = true;

              $element.addClass(draggingClassName);

              var dataTransfer = event.dataTransfer || event.originalEvent.dataTransfer;

            //  dataTransfer.effectAllowed = 'move';
              dataTransfer.effectAllwed= 'copyMove';
              dataTransfer.dropEffect = 'move';
              dataTransfer.setData('text/plain', $scope.$parent.$mdChipsCtrl.items.indexOf($scope.$parent.$chip));
            }
          });

          $element.on('dragend', function () {
            dragging = false;

            $element.removeClass(draggingClassName);
          });

          var dragOverHandler = function (event) {
            if (dragging) {
              return;
            }

            event.preventDefault();

            var bounds = $element[0].getBoundingClientRect();

            var props = {
              width: bounds.right - bounds.left,
              height: bounds.bottom - bounds.top,
              x: (event.originalEvent || event).clientX - bounds.left,
              y: (event.originalEvent || event).clientY - bounds.top,
            };

            var offset = options.axis === 'vertical' ? props.y : props.x;
            var midPoint = (options.axis === 'vertical' ? props.height : props.width) / 2;

            $element.addClass(droppingClassName);

            if (offset < midPoint) {
              dropPosition = 'before';
              $element.removeClass(droppingAfterClassName);
              $element.addClass(droppingBeforeClassName);

            } else {
              dropPosition = 'after';
              $element.removeClass(droppingBeforeClassName);
              $element.addClass(droppingAfterClassName);
            }
          };

          var dropHandler = function (event) {
            console.log("dropped!");
            event.preventDefault();

            var droppedItemIndex = parseInt((event.dataTransfer || event.originalEvent.dataTransfer).getData('text/plain'), 10);
            var currentIndex = $scope.$parent.$mdChipsCtrl.items.indexOf($scope.$parent.$chip);
            var newIndex = null;

            if (dropPosition === 'before') {
              if (droppedItemIndex < currentIndex) {
                newIndex = currentIndex - 1;
              } else {
                newIndex = currentIndex;
              }
            } else {
              if (droppedItemIndex < currentIndex) {
                newIndex = currentIndex;
              } else {
                newIndex = currentIndex + 1;
              }
            }

            // prevent event firing multiple times in firefox
            $timeout.cancel(dropTimeout);
            dropTimeout = $timeout(function () {
              dropPosition = null;

              move.apply($scope.$parent.$mdChipsCtrl.items, [droppedItemIndex, newIndex]);

              $scope.$apply(function () {
                $scope.$emit('mdChipDraggable:change', {
                  collection: $scope.$parent.$mdChipsCtrl.items,
                  item: $scope.$parent.$mdChipsCtrl.items[newIndex],
                  from: droppedItemIndex,
                  to: newIndex
                });
              });

              $element.removeClass(droppingClassName);
              $element.removeClass(droppingBeforeClassName);
              $element.removeClass(droppingAfterClassName);

              $element.off('drop', dropHandler);
            }, 1000 / 16);
          };

          $element.on('dragenter', function () {
            console.log('valid drop location');
            if (dragging) {
              return;
            }

            $element.off('dragover', dragOverHandler);
            $element.off('drop', dropHandler);

            $element.on('dragover', dragOverHandler);
            $element.on('drop', dropHandler);
          });

          $element.on('dragleave', function (event) {
            $element.removeClass(droppingClassName);
            $element.removeClass(droppingBeforeClassName);
            $element.removeClass(droppingAfterClassName);
          });

        }],
    };
  });