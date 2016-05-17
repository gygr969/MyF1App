function recuperarDatos(url, callback)
{
    $.ajax({
        url: url,
        type: 'GET',
        dataType:"jsonp",
        success: function(data) 
        {
            callback(data);
        },
        error: function(jqXHR, textStatus, error) 
        {
            alert( "error: " + jqXHR.responseText);
        }
    });
}

function recuperarDatos2(url, tipo)
{
    $.ajax({
        url: url,
        type: 'GET',
        dataType:"jsonp",
        success: function(data) 
        {
            switch(tipo)
            {
                case "pilotos":         localStorage.setItem("pilotos", JSON.stringify(data));
                                        break;
                                    
                case "constructores":   localStorage.setItem("constructores", JSON.stringify(data));
                                        break;
                
                case "carrera":         localStorage.setItem("carrera", JSON.stringify(data));
                                        break;
                
                case "calendario":      localStorage.setItem("calendario", JSON.stringify(data));
                                        break;
                
                case "circuitos":       localStorage.setItem("circuitos", JSON.stringify(data));
                                        break;
            }
        },
        error: function(jqXHR, textStatus, error) 
        {
            alert( "error: " + jqXHR.responseText);
        }
    });
}

function anadirMarcador(mapa, posicion,contenido)
{
    var opcionesMarcador = 
    {
        position: posicion,
        map: mapa,
        icon: "./icons/marker.png",
        clickable: true
    };
    var marcador = new google.maps.Marker(opcionesMarcador);

    var opcionesVentanaInformacion = 
    {
        content: "<span class='info'>"+ contenido +"</span>",
        position: posicion
    };
    var ventanaInformacion = new google.maps.InfoWindow(opcionesVentanaInformacion);

    google.maps.event.addListener(marcador, "click", function() 
    {
            ventanaInformacion.open(map);
    });

}

function mostrarMapa() 
{
    var centro = new google.maps.LatLng(19.416775400000000000,19.703790199999957600);
    var opcionesMapa = 
    {
        zoom: 1,
        center: centro,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    var divMap = document.getElementById("mapa");
    map = new google.maps.Map(divMap, opcionesMapa);
    
    return map;
}

function pilotos(data) 
{
    var pilotos = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    
    $('#contenidoPilotos').empty();
    $('#contenidoPilotos').append('<table class="fullTable">');
    $('#contenidoPilotos table').append('<thead>');
    $('#contenidoPilotos table').append('<tbody>');
    $('#contenidoPilotos table thead').append('<tr><th class="mobileHide">Posición</th><th>Nombre</th><th>Escudería</th><th>Puntos</th></tr>');
    
    for (var i=0; i < pilotos.length; i++)
    {
        var piloto = pilotos[i];
        $('#contenidoPilotos table tbody').append('<tr><td class="mobileHide">' + (i+1) + '</td><td>' + piloto.Driver.givenName + " " + piloto.Driver.familyName + " </td><td> " + piloto.Constructors[0].name + "  </td><td>" + piloto.points + '</td></tr>');
    }	
}

function constructores(data) 
{
    var constructores = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
    
    //$('nav').hide();
    $('#contenidoConstructores').empty();
    $('#contenidoConstructores').append('<table class="fullTable">');
    $('#contenidoConstructores table').append('<thead>');
    $('#contenidoConstructores table').append('<tbody>');
    $('#contenidoConstructores table thead').append('<tr><th>Posición</th><th>Nombre</th><th class="mobileHide">Nacionalidad</th><th>Puntos</th></tr>');
    
    for (var i=0; i < constructores.length; i++)
    {
        var constructor = constructores[i];
        $('#contenidoConstructores table tbody').append('<tr><td>' + (i+1) + '</td><td>'+ constructor.Constructor.name + "</td><td class='mobileHide'>" + constructor.Constructor.nationality + "</td><td>" + constructor.points + '</td></tr>');
    }	
}

function ultimaCarrera(data)
{
    var resultados = data.MRData.RaceTable.Races[0].Results;
    $('#contenidoUltimaCarrera').empty();
    $('#contenidoUltimaCarrera').append('<table class="fullTable">');
    $('#contenidoUltimaCarrera table').append('<thead>');
    $('#contenidoUltimaCarrera table').append('<tbody>');
    $('#contenidoUltimaCarrera table thead').append('<tr><th>Posición</th><th>Piloto</th><th class="mobileHide">Escudería</th><th class="mobileHide">Vueltas</th><th class="mobileHide">Posición en parrilla</th><th class="mobileHide">Tiempo</th><th class="mobileHide">Estado</th><th>Puntos</th></tr>');
            
    for (var i=0; i < resultados.length; i++)
    {
        var resultado = resultados[i];
        if(resultado.hasOwnProperty("Time"))
        {
            $('#contenidoUltimaCarrera table tbody').append('<tr><td>'  + resultado.position + '</td><td>'  
                    + resultado.Driver.givenName + " " + resultado.Driver.familyName + '</td><td class="mobileHide">' 
                    + resultado.Constructor.name + '</td><td class="mobileHide">' + resultado.laps + '</td><td class="mobileHide">' 
                    + resultado.grid + '</td><td class="mobileHide">' + resultado.Time.time + '</td><td class="mobileHide">' 
                    + resultado.status + '</td><td>' + resultado.points + '</td></tr>');
        }
        else
        {
            $('#contenidoUltimaCarrera table tbody').append('<tr><td>'  + resultado.position + '</td><td>'  
                    + resultado.Driver.givenName + " " + resultado.Driver.familyName + '</td><td class="mobileHide">' 
                    + resultado.Constructor.name + '</td><td class="mobileHide">' + resultado.laps + '</td><td class="mobileHide">' 
                    + resultado.grid + '</td><td class="mobileHide">No time</td><td class="mobileHide">' 
                    + resultado.status + '</td><td>' + resultado.points + '</td></tr>');
        }
    }
}

function calendario(data) 
{
    var carreras = data.MRData.RaceTable.Races;
    var map;
    $('#contenidoCalendario').empty();
    $('#contenidoCalendario').append('<table class="halfTable">');
    if(flagConnection === 0)
    {
        $('#contenidoCalendario').append('<div id="mapa" class="mapa mobileHide">');
    }
    $('#contenidoCalendario table').append('<thead>');
    $('#contenidoCalendario table').append('<tbody>');
    $('#contenidoCalendario table thead').append('<tr><th class="mobileHide tabletHide">Número</th><th>Carrera</th><th class="mobileHide tabletHide">Circuito</th><th>Fecha</th></tr>');
    
    if(flagConnection === 0)
    {
        map = mostrarMapa();
    }
    
    for (var i=0; i < carreras.length; i++)
    {
        var carrera = carreras[i];
        
        if(flagConnection === 0)
        {
            var latitude = carrera.Circuit.Location.lat;
            var longitude = carrera.Circuit.Location.long;
            var centro = new google.maps.LatLng(latitude, longitude);
            anadirMarcador(map, centro, carrera.Circuit.circuitName);
        }
        $('#contenidoCalendario table tbody').append('<tr><td class="mobileHide tabletHide">'  + carrera.round + '</td><td>'  + carrera.raceName + '</td><td class="mobileHide tabletHide">' + carrera.Circuit.circuitName + '</td><td>' + carrera.date + '</td></tr>');
    }
}

function circuitos(data) 
{
    var circuitos = data.MRData.CircuitTable.Circuits;
    $('#contenidoCircuitos').empty();
    $('#contenidoCircuitos').append('<table class="fullTable">');
    $('#contenidoCircuitos table').append('<thead>');
    $('#contenidoCircuitos table').append('<tbody>');
    $('#contenidoCircuitos table thead').append('<tr><th class="mobileHide">Número</th><th>Nombre</th><th class="mobileHide">Localidad</th><th>País</th></tr>');
    
    for (var i=0; i < circuitos.length; i++) 
    {
        var circuito = circuitos[i];
        $('#contenidoCircuitos table tbody').append('<tr><td class="mobileHide">' + (i+1) + '</td><td>' +circuito.circuitName + '</td><td class="mobileHide">' + circuito.Location.locality +'</td><td>' + circuito.Location.country + '</td></tr>');
    }
}

var flagConnection;

window.addEventListener("load", function()
{
    if (navigator.onLine)
    {
        flagConnection = 0;
        recuperarDatos2('http://ergast.com/api/f1/current/driverStandings.json', 'pilotos');
        recuperarDatos2('http://ergast.com/api/f1/current/constructorStandings.json', 'constructores');
        recuperarDatos2('http://ergast.com/api/f1/current/last/results.json', 'carrera');
        recuperarDatos2('http://ergast.com/api/f1/current.json', 'calendario');
        recuperarDatos2('http://ergast.com/api/f1/current/circuits.json', 'circuitos');
        console.log("Carga de datos en el LocalStorage completada");
    }
    else
    {
        flagConnection = 1;
    }

});
if ("onLine" in navigator) 
{ 
    window.addEventListener("online", function online() 
    {
        flagConnection = 0;
        alert("Ya tienes conexión");
        console.log("estamos on");
    });

    window.addEventListener("offline", function offline(e) 
    {
        flagConnection = 1;
        alert("Estas sin conexión. Los datos utilizados serán recogidos del localstorage");
        console.log("estamos off");
    });
} 
else 
{
    console.log("not supported");
}

$(document).on( "pageshow", '#main, #divPilotos, #divCircuitos, #divCalendario',  function()
{
    ScaleContentToDevice() ;      
});
$('#main').on('pageinit', function() 
{
    $('#divPilotos').on({
        pageshow: function() 
        {
            if(flagConnection === 0)
            {
                recuperarDatos('http://ergast.com/api/f1/current/driverStandings.json', pilotos);
            }
            else
            {
                pilotos(JSON.parse(localStorage.getItem("pilotos")));
                console.log("Datos de Pilotos recogidos del LocalStorage");
            }
        }
    });
    $('#divConstructores').on({
        pageshow: function() 
        {
            if(flagConnection === 0)
            {
                recuperarDatos('http://ergast.com/api/f1/current/constructorStandings.json', constructores);
            }
            else
            {
                constructores(JSON.parse(localStorage.getItem("constructores")));
                console.log("Datos de Constructores recogidos del LocalStorage");
            }
        }
    });
    $('#divUltimaCarrera').on({
        pageshow: function() 
        {
            if(flagConnection === 0)
            {
                recuperarDatos('http://ergast.com/api/f1/current/last/results.json', ultimaCarrera);
            }
            else
            {
                ultimaCarrera(JSON.parse(localStorage.getItem("carrera")));
                console.log("Datos de la ultima carrera recogidos del LocalStorage");
            }
        }
    });
    $('#divCalendario').on({
        pageshow: function() 
        {
            if(flagConnection === 0)
            {
                recuperarDatos('http://ergast.com/api/f1/current.json', calendario);
            }
            else
            {
                calendario(JSON.parse(localStorage.getItem("calendario")));
                $('#contenidoCalendario table').css({'width':'95%', 'margin-left':'15px'});
                console.log("Datos de Calendario recogidos del LocalStorage");
            }
        }
    });
    $('#divCircuitos').on({
        pageshow: function() 
        {
            if(flagConnection === 0)
            {
                recuperarDatos('http://ergast.com/api/f1/current/circuits.json', circuitos); 
            }
            else
            {
                circuitos(JSON.parse(localStorage.getItem("circuitos")));
                console.log("Datos de Circuitos recogidos del LocalStorage");
            }
        }
    });
});

$(window).on("resize orientationchange", function()
{
    ScaleContentToDevice();
});
function ScaleContentToDevice()
{
    scroll(0, 0);
    var content = $.mobile.getScreenHeight() - $(".ui-header").outerHeight() - $(".ui-footer").outerHeight() - $(".ui-content").outerHeight() + $(".ui-content").height();
    $(".ui-content").height(content);
}

$( window ).on( "orientationchange", function() 
{   
    switch(window.orientation)
    {
        case 0:     alert("Estas en Portrait");
                    break;
        case -90:   alert("Landscape girado sentido agujas reloj");
                    break;
        case 90:    alert("Landscape girado sentido contrario agujas reloj");
                    break;
        case 180:   alert("Estas en Portrait boca abajo");
                    break;
    }
});


