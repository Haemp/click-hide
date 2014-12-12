/**
 * @author: +HampusAhlgren
 *
 * Click anywhere else but in the directive element and it will trigger
 * the given function.
 *
 */
var ClickHide = angular.module('ClickHide', []);

ClickHide.directive('clickHide', function( $document, $parse, $timeout ){

	return{
		link: function( $scope, element, attr ){


			$scope._init = function(){

				if(attr.chActivate){
					$scope.$watch( attr.chActivate, $scope.onActivationChange );
				}else{
					// activate imediatly
					$scope.listenForClick();
				}

				//clean up
				$scope.$on('$destroy', function(){
					$document.unbind('click', $scope.onClick);
				});
			}

			$scope.onActivationChange = function( newValue ){

				if( newValue == true ){
					$scope.listenForClick();
				}
				// in the case that the user changed the activation
				// condition without clicking outside the parentElement
				// ex. Clicking close instead. We then wan't to make sure
				// we unbind the click listener - otherwise we'll get some
				// funky behaviour.
				else if( newValue == false ){
					$document.unbind('click', $scope.onClick);
				}
			}

			$scope.listenForClick = function(){

				$timeout(function(){

					// Make sure we don't allow multiple listeners
					// can't rely n the destroy always being run.
					$document.unbind('click', $scope.onClick);
					$document.on('click', $scope.onClick);
				}, 10);
			}

			/**
			 * First click after activating.
			 */
			$scope.onClick = function( e ){

				// check if the user has clicked outside of the
				// element
				if( !$scope._isDecendantOfParent(e.target, element) ){ // yes he did

					// parse and execute the click
					// action
					$scope.$apply(function(){
						$parse(attr.chClick)($scope);
					});

					$document.unbind('click', $scope.onClick); // now we don't have to listen anymore
				}
			}

			/**
			 *
			 */
			$scope._isDecendantOfParent = function( decendantElement, parentElement ){

				var currentParent = decendantElement;
				while( currentParent.nodeName != 'BODY' ){
					if( currentParent == parentElement[0] ){ return true }

					currentParent = currentParent.parentNode;

					// We're iterating inside a DOM fragment that's not
					// attached to the DOM.
					if( currentParent ==  null ) return true;
				}
				return false;
			}
			$scope._init();
		}
	}
});
