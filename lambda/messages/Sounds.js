'use strict';
module.exports = {
    Description:{
        CODE:'効果音・音楽情報識別用のユニーク値',
        TYPE:'SOUND_LIBRARY→Amazonのサウンドライブラリの音 S3_PUBLIC→S3で公開している音 S3_PRIVATE→S3で未公開にしている音',
        KEY:'SOUND_LIBRARYの場合、省略可 S3の場合、キーの値',
        VALUE:'SOUND_LIBRARYの場合、サウンドライブラリからコピーしたSSML、S3の場合、省略可'
    },
    Sounds:[
        {
            CODE:'EXPLAIN_BRIDGE',
            TYPE:'SOUND_LIBRARY',
            KEY:'dummy',
            VALUE:'<audio src="soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_positive_response_01"/>'
        },
        {
            CODE:'SKILL_OPENING',
            TYPE:'SOUND_LIBRARY',
            KEY:'dummy',
            VALUE:'<audio src="soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_bridge_01"/>'
        },
        {
            CODE:'QUESTION_BRIDGE',
            TYPE:'SOUND_LIBRARY',
            KEY:'dummy',
            VALUE:'<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_14"/>'
        },
        {
            CODE:'OK',
            TYPE:'SOUND_LIBRARY',
            KEY:'dummy',
            VALUE:'<audio src="soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_positive_response_01"/>'
        },
        {
            CODE:'NG',
            TYPE:'SOUND_LIBRARY',
            KEY:'dummy',
            VALUE:'<audio src="soundbank://soundlibrary/gameshow/gameshow_04"/>'
        },
        {
            CODE:'SKILL_ENDING',
            TYPE:'SOUND_LIBRARY',
            KEY:'dummy',
            VALUE:'<audio src="soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_outro_01"/>'
        },
    ]
}