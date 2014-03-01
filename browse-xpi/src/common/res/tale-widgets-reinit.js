//Re-init TheTale's widgets
widgets.log = new pgf.game.widgets.Log('#log-block',
    updater, widgets,
    {type: 'log',
        dataMode: "pve" } );
widgets.equipment = new pgf.game.widgets.Equipment('#hero-equipment',
    updater, widgets,
    {dataMode: "pve"});
widgets.bag = new pgf.game.widgets.Bag('#hero-bag-block',
    updater, widgets,
    {});

var tileset = pgf.game.constants.tilesets[pgf.base.settings.get("game_map_tileset", "main")];
var spritesManager = new pgf.game.resources.ImageManager(tileset.sprites,
    { staticUrl: "//the-tale.org/static/158/",
    });

widgets.mapManager = new pgf.game.map.MapManager({RegionUrl: function(version){return '//the-tale.org/dcont/map/region-'+version+'.js';},
    currentMapVersion: '5238720-1393661308'});
widgets.map = new pgf.game.map.Map('#pgf-game-map',
    {spritesManager: spritesManager,
        tileSize: tileset.TILE_SIZE,
        canvasWidth: 400,
        widgets: widgets});

widgets.diary = new pgf.game.widgets.Log('#diary-block',
    updater, widgets,
    {type: 'diary',
        dataMode: 'pve'} );

widgets.quests_line = new pgf.game.widgets.QuestsLine('#quests-line-block',
    updater, widgets,
    { } );
widgets.heroes = new pgf.game.widgets.Hero("#hero-short-data", updater, widgets, {dataMode: "pve"});
widgets.actions = new pgf.game.widgets.Action('#current-action-block', updater, widgets);
widgets.abilities = new pgf.game.widgets.Abilities();


widgets.quest = new pgf.game.widgets.Quest('#current-quest-block',
    updater, widgets,
    {chooseUrl: "/game/quests/api/choose?api_client=the_tale-v0.3.9.8&api_version=1.0" } );