(function ($) {
    ymaps.ready(function() {
        // Set behaviors to map
        var set_behaviors = [];
        $.each($('#edit-behaviors-options input:checked'), function(index, value){
            set_behaviors.push(value['value']);
        });
        
        // Init map
        var addYMap = new ymaps.Map('addYMap', {
            center: [55.76, 37.64],
            zoom: 7,
            behaviors: set_behaviors
        });

        jQuery('#edit-lon').val(addYMap.getCenter()[0]);
        jQuery('#edit-lat').val(addYMap.getCenter()[1]);
        jQuery('#edit-zoom').val(addYMap.getZoom());
        
        // Add type selector controls
        addYMap.controls.add(new ymaps.control.TypeSelector(Drupal.settings.ymaps_types));
        addYMap.controls.add('mapTools');

        // Set map type to current selectbox value
        addYMap.setType(jQuery('#edit-default-type').val());
        
        // Add listener to selectbox
        jQuery('#edit-default-type').change(function(context){
            var newType = jQuery(this).val();
            addYMap.setType(newType);
        })
        
        jQuery('#edit-lon').change(function(){
            addYMap.setCenter(jQuery(this).val(), addYMap.getCenter[1]);
        });
        jQuery('#edit-lat').change(function(){
            addYMap.setCenter(addYMap.getCenter[0], jQuery(this).val());
        });
        jQuery('#edit-zoom').change(function(){
            addYMap.setZoom(jQuery(this).val());
        });
        
        $('#edit-behaviors-options input:not(.behaviors-processed)').addClass('behaviors-processed').
        each(function(){
            $(this).change(function(){
                var key = $(this).val();
                var checked = $(this).is(':checked');
                if(checked && !(addYMap.behaviors.isEnabled(key))){
                    addYMap.behaviors.enable(key);
                }
                else {
                    addYMap.behaviors.disable(key);
                }
            });
        });
        
        addYMap.events.add(['boundschange', 'typechange'], setLocation);
        
        // Callback
        function setLocation () {
            var params = [
            addYMap.getType(), // Map type
            addYMap.getCenter(), // Center of map
            addYMap.getZoom() // Zoom
            ];
            
            jQuery('#edit-default-type').val(params[0]);
            jQuery('#edit-lon').val(params[1][0]);
            jQuery('#edit-lat').val(params[1][1]);
            jQuery('#edit-zoom').val(params[2]);
        }
        
        addYMap.events.add('click', function(e){
            var coords = e.get('coordPosition');
            
            var properties = {
                balloonContent: 'Hello <b>Yandex!</b>',
                hintContent: "Метка",
                iconContent: "Content"
            },
            options = {
                balloonCloseButton: true,
                draggable: true // Метку можно перетаскивать, зажав левую кнопку мыши.
            },
            placemark = new ymaps.Placemark(coords, properties, options);
    
            newPlacemark = new ymaps.Placemark(coords);
            newPlacemark.events.add('click', function(e){
                alert(e.get('coordPosition'));
            })
            addYMap.geoObjects.add(placemark);
        })

    })
})(jQuery);
