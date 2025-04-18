'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionButton from '@/components/SectionButton';
import MovieCard from '@/components/MovieCard';
import { getWatchedMovies } from '@/utils/localStorage';

type Section = 'watched' | 'explore' | 'special' | 'rana';

// Sabit bölümler
const sections: { id: Section; title: string; color: 'orange' | 'amber' | 'purple' | 'pink' }[] = [
  { id: 'watched', title: 'İzlediklerim', color: 'orange' },
  { id: 'explore', title: 'Depo (İzleyeceklerim)', color: 'amber' },
  { id: 'special', title: "Melih'in Özel Seçimleri", color: 'purple' },
  { id: 'rana', title: '🌹 Rana\'nın Özel Bölümü', color: 'pink' },
];

// Film verileri - görseller kaldırıldı
const movies = {
  watched: [
    { 
      title: 'Toy Story Serisi',
      imageUrl: 'https://image.tmdb.org/t/p/w300/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg',
      description: 'Oyuncaklarınızın canlandığını hayal edin! Buzz ve Woody\'nin dostluk hikayesi, çocukluğunuza nostaljik bir yolculuk yapmanızı sağlayacak. Hem çocukların hem de yetişkinlerin kalbini çalacak efsane seri!'
    },
    { 
      title: 'Kung Fu Panda Serisi',
      imageUrl: 'https://image.tmdb.org/t/p/w300/wWt4JYXTg5Wr3xBW2phBrMKgp3x.jpg',
      description: 'Dövüş sanatları ve komediyi sevenler için mükemmel bir karışım! Şişman ve tembel panda Po\'nun inanılmaz kung fu ustası olma yolculuğunda kahkahalar ve aksiyonla dolu anlar sizi bekliyor.'
    },
    { 
      title: 'Madagaskar Serisi',
      imageUrl: 'https://image.tmdb.org/t/p/w300/zPpGxp9nXxHLkIONyT0CC8FYHeZ.jpg',
      description: 'New York hayvanat bahçesinden vahşi doğaya uzanan çılgın bir macera! Aslan Alex ve arkadaşlarının "Hareket etmeyi seviyorum!" diyeceğiniz eğlenceli yolculuğu sizi şehir hayatından uzaklara götürecek.'
    },
    { 
      title: 'Zootopia',
      imageUrl: 'https://image.tmdb.org/t/p/w300/hlK0e0wAQ3VLuJcsfIYPvb4JVud.jpg',
      description: 'Memelilerin uyum içinde yaşadığı modern bir şehir düşünün. Tavşan polis Judy\'nin ilk davasını çözmek için kurnaz tilki Nick ile yaptığı ortaklık, toplumsal mesajları da içeren heyecanlı bir polisiye!'
    },
    { 
      title: 'Big Hero 6',
      imageUrl: 'https://image.tmdb.org/t/p/w300/9gLu47Zw5ertuFTZaxXOvNfy78T.jpg',
      description: 'Robotlar ve süper kahramanları seviyorsanız bu film tam size göre! Hiro ve şişman sağlık robotu Baymax\'in dokunaklı dostluk hikayesi, aksiyon ve duygusal anlarla sizi ekrana bağlayacak.'
    },
    { 
      title: 'Cars Serisi',
      imageUrl: 'https://image.tmdb.org/t/p/w300/qa6HCwP4Z15l3hpsASz3auugEW6.jpg',
      description: 'Konuşan arabalar dünyasına adım atın! Şimşek McQueen ve arkadaşlarının yarış heyecanı ve dostluk hikayeleri, araba tutkunlarını ekrana kilitleyecek. Yarış severseniz bu seri kesinlikle garajınızda olmalı!'
    },
    { 
      title: 'How to Train Your Dragon Serisi',
      imageUrl: 'https://image.tmdb.org/t/p/w300/ygGmAO60t8GyqUo9xYeYxSZAR3b.jpg',
      description: 'Ejderhalarla dost olmak mümkün mü? Viking Hıçkıdık ve dişsiz ejderhası arasındaki benzersiz bağ, nefes kesen görsellerle size fantastik bir dünya sunuyor. Macera ve dostluk arayanlar için ideal!'
    },
    { 
      title: 'The Incredibles Serisi',
      imageUrl: 'https://image.tmdb.org/t/p/w300/2mUqHJG4Y5Ux5oTPKN51kQ3PRwx.jpg',
      description: 'Süper güçlere sahip bir aile düşünün! Hem günlük hayatın zorluklarıyla hem de süper kötülerle mücadele eden Parr ailesi, aksiyon ve komediyi mükemmel harmanlarken aile bağlarının önemini vurguluyor.'
    },
    { 
      title: 'Monsters, Inc.',
      imageUrl: 'https://image.tmdb.org/t/p/w300/sgheSKxZkttIe8ONsf2sWXPgip3.jpg',
      description: 'Çocukların korkularıyla enerji üretilen bir dünyada, en korkunç canavar Sulley ve tek gözlü yardımcısı Mike\'ın hayatı küçük bir kız çocuğuyla tamamen değişir. Dostluk ve kahkahanın ön planda olduğu eğlenceli macera!'
    },
    { 
      title: 'WALL·E',
      imageUrl: 'https://image.tmdb.org/t/p/w300/Agc6lw8pb6BIGVegwvYHxG48KKn.jpg',
      description: 'Terk edilmiş bir Dünya\'da tek başına çöpleri temizleyen sevimli robot WALL-E, gelişmiş bir arama robotu EVE ile tanışınca, tüm insanlığın kaderini değiştirecek bir maceraya atılır. Az diyalogla çok şey anlatan olağanüstü animasyon!'
    },
    { 
      title: 'Finding Nemo',
      imageUrl: 'https://image.tmdb.org/t/p/w300/eHuGQ10FUzK1mdOY69wF5pGgEf5.jpg',
      description: 'Okyanuslarda geçen muhteşem bir macera! Oğlunu kaybeden balık Marlin\'in, sevimli ama unutkan Dory ile birlikte Sydney\'e uzanan yolculuğu, ebeveynlik, cesaret ve dostluk temalarını su altı dünyasının güzellikleriyle buluşturuyor.'
    },
    { 
      title: 'Moana',
      imageUrl: 'https://image.tmdb.org/t/p/w300/4JeRiWOvP6qcvwHXZyXtbK9JPVR.jpg',
      description: 'Polinezya efsanelerinden ilham alan bu film, cesur genç kız Moana\'nın halkını kurtarmak için yarı tanrı Maui ile denize açılmasını anlatıyor. Muhteşem müzikleri ve kültürel zenginliğiyle kalbinizi fethedecek!'
    },
    { 
      title: 'Turning Red',
      imageUrl: 'https://image.tmdb.org/t/p/original/qsdjk9oAKSQMWs0Vt5Pyfh6O4GZ.jpg',
      description: '13 yaşındaki Mei, heyecanlandığında dev bir kırmızı pandaya dönüşür.'
    },
    { 
      title: 'Inside Out',
      imageUrl: 'https://image.tmdb.org/t/p/original/2H1TmgdfNtsKlU9jKdeNyYL5y8T.jpg',
      description: 'Riley\'nin beynindeki duygular, onun yeni bir şehre taşınmasıyla birlikte karmaşık bir durumla karşı karşıya kalır.'
    },
    { 
      title: 'Elemental',
      imageUrl: 'https://image.tmdb.org/t/p/original/4Y1WNkd88JXmGfhtWR7dmDAo1T2.jpg',
      description: 'Ateş ve su elementlerinin temsilcileri Ember ve Wade, Element Şehri\'nde beklenmedik bir arkadaşlık kurar.'
    },
    { 
      title: 'Soul',
      imageUrl: 'https://lumiere-a.akamaihd.net/v1/images/p_soul_disneyplus_v2_20907_764da65d.jpeg',
      description: 'Jazz müzisyeni Joe, ölümden sonraki yaşamda kendini bulur ve hayatın anlamını keşfeder.'
    },
    { 
      title: 'Onward',
      imageUrl: 'https://image.tmdb.org/t/p/original/f4aul3FyD3jv3v4bul1IrkWZvzq.jpg',
      description: 'İki elf kardeş, babalarını 24 saatliğine hayata döndürmek için büyülü bir maceraya atılır.'
    },
    { 
      title: 'Brave',
      imageUrl: 'https://image.tmdb.org/t/p/original/1XAuDtMWpL0eNn0PV6YTh6C3neD.jpg',
      description: 'İskoç prensesi Merida, annesini bir ayıya dönüştüren bir laneti kırmak için mücadele eder.'
    },
    { 
      title: 'Puss in Boots: The Last Wish',
      imageUrl: 'https://image.tmdb.org/t/p/original/kuf6dutpsT0vSVehic3EZIqkOBt.jpg',
      description: 'Kedilerin son dileği, Puss in Boots\'un son hayatını kurtarmak için tehlikeli bir yolculuğa çıkmasına neden olur.'
    },
    { 
      title: 'Despicable Me Serisi',
      imageUrl: 'https://image.tmdb.org/t/p/original/teyD8Ca6zUwcwRvfaVDd0DrR6YF.jpg',
      description: 'Süper kötü Gru, üç yetim kızın hayatına girmesiyle değişir ve onların babası olur.'
    },
    { 
      title: 'Frozen Serisi',
      imageUrl: 'https://image.tmdb.org/t/p/original/kgwjIb2JDHRhNk13lmSxiClFjVQ.jpg',
      description: 'Kraliçe Elsa\'nın buz güçleri, krallığı sonsuz kışa mahkum eder. Kız kardeşi Anna, onu bulmak için yola çıkar.'
    },
    { 
      title: 'Tangled',
      imageUrl: 'https://image.tmdb.org/t/p/original/ym7Kst6a4uodryxqbGOxmewF235.jpg',
      description: 'Uzun saçlı prenses Rapunzel, kuleye hapsedilmiş hayatından kaçarak maceraya atılır.'
    },
    { 
      title: 'The Mitchells vs. The Machines',
      imageUrl: 'https://image.tmdb.org/t/p/original/q64FvAf1RYGhZD3Gh3H8YZd5TZl.jpg',
      description: 'Mitchell ailesi, robotların dünyayı ele geçirmesini engellemek için birlikte çalışır.'
    },
    { 
      title: 'Cloudy with a Chance of Meatballs',
      imageUrl: 'https://image.tmdb.org/t/p/original/qhOhIHpY5Cb6z0Q7wFKpyAbxr3y.jpg',
      description: 'Genç mucit Flint Lockwood, yiyecek yağdıran bir makine icat eder, ancak işler kontrolden çıkar.'
    },
    { 
      title: 'Wreck-It Ralph',
      imageUrl: 'https://image.tmdb.org/t/p/original/93FsllrXXWrqEQJlLXA5HBMH0Zr.jpg',
      description: 'Video oyunu kötü adamı Ralph, kahraman olmak için farklı oyunlara atlar.'
    },
    { 
      title: 'Megamind',
      imageUrl: 'https://image.tmdb.org/t/p/original/6n2b01sM67tBnAu6sUc0pU0KdXm.jpg',
      description: 'Süper kötü Megamind, rakibi Metro Man\'i yendikten sonra hayatının anlamını sorgulamaya başlar.'
    },
    { 
      title: 'The Lego Movie',
      imageUrl: 'https://m.media-amazon.com/images/M/MV5BMTg4MDk1ODExN15BMl5BanBnXkFtZTgwNzIyNjg3MDE@._V1_.jpg',
      description: 'Sıradan Lego figürü Emmet, kendini "Özel" olarak seçilmiş biri olarak bulur ve kötü Lord Business\'a karşı savaşır.'
    },
    { 
      title: 'Encanto',
      imageUrl: 'https://image.tmdb.org/t/p/original/4j0PNHkMr5ax3IA8tjtxcmPU3QT.jpg',
      description: 'Madrigal ailesinin her üyesi özel bir güce sahiptir, ancak Mirabel bu güçlerden yoksundur.'
    },
    { 
      title: 'Luca',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/3/33/Luca_%282021_film%29.png',
      description: 'Deniz canavarı Luca, İtalyan Rivierası\'nda insan olarak yaşamak için maceraya atılır.'
    },
    { 
      title: 'Monsters University',
      imageUrl: 'https://image.tmdb.org/t/p/original/y7HKXUEECjWhbO7v5zk6n6R7rQq.jpg',
      description: 'Sulley ve Mike, Monsters University\'de tanışır ve korkutma şampiyonası için birlikte çalışır.'
    },
    { 
      title: 'Sing',
      imageUrl: 'https://image.tmdb.org/t/p/original/qR9iyUH0dR1gISvCOh2taeCBEvS.jpg',
      description: 'Koala Buster Moon, tiyatrosunu kurtarmak için bir şarkı yarışması düzenler.'
    },
    { 
      title: 'Minions',
      imageUrl: 'https://image.tmdb.org/t/p/original/vlOgaxUiMOA8sPDG9n3VhQabnEi.jpg',
      description: 'Minionlar, en kötü patronlarını bulmak için tarih boyunca bir yolculuğa çıkar.'
    },
    { 
      title: 'Rango',
      imageUrl: 'https://image.tmdb.org/t/p/original/oHxKPJ1VzGx65O0DlSAIxjHfT0G.jpg',
      description: 'Evcil kertenkele Rango, kendini bir kasabanın şerifi olarak bulur ve su kaynağını korumak için mücadele eder.'
    },
    { 
      title: 'Flushed Away',
      imageUrl: 'https://image.tmdb.org/t/p/original/u2GJsBiALyJknXHGOGH7PFKRcJr.jpg',
      description: 'Zengin fare Roddy, klozetten aşağı düşerek Londra kanalizasyon sisteminde maceraya atılır.'
    },
    { 
      title: 'Robots',
      imageUrl: 'https://m.media-amazon.com/images/M/MV5BZmJhNTQwY2MtYTU0Yy00MjY5LTk5YWMtZTdiMDFlNmZhNWI4XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
      description: 'Genç robot Rodney, büyük şehirde mucit olma hayalini gerçekleştirmeye çalışır.'
    },
    { 
      title: "Surf's Up",
      imageUrl: 'https://m.media-amazon.com/images/M/MV5BMjE4NDE3NzcwM15BMl5BanBnXkFtZTcwMTI0ODYzMw@@._V1_.jpg',
      description: 'Penguen Cody Maverick, sörf şampiyonasına katılmak için maceraya atılır.'
    },
    { 
      title: 'The Peanuts Movie',
      imageUrl: 'https://image.tmdb.org/t/p/original/gRH3NiQ3QZAbUImzNKGCZOxnR3r.jpg',
      description: 'Charlie Brown, yeni kız arkadaşına etkilemek için her şeyi dener.'
    },
    { 
      title: 'The Angry Birds Movie',
      imageUrl: 'https://image.tmdb.org/t/p/original/nsaaHcexA8BtTj3tCQsJ05Di2QA.jpg',
      description: 'Kızgın kuşlar, yumurtalarını çalan domuzlardan intikam almak için maceraya atılır.'
    },
    { 
      title: 'Epic',
      imageUrl: 'https://m.media-amazon.com/images/M/MV5BMTgyNDYwNzQ3OV5BMl5BanBnXkFtZTcwMzUyODM5OA@@._V1_.jpg',
      description: 'Genç kız MK, ormanın koruyucuları olan küçük insanların dünyasına girer.'
    },
    { 
      title: 'The Good Dinosaur',
      imageUrl: 'https://image.tmdb.org/t/p/original/8ZeYSe8FLBTXGZtyUtqGqAgm5Gw.jpg',
      description: 'Dinozor Arlo, evine dönmek için küçük bir insan çocuğuyla birlikte tehlikeli bir yolculuğa çıkar.'
    },
  ],
  explore: [
    { 
      title: 'Raya and the Last Dragon',
      imageUrl: 'https://image.tmdb.org/t/p/w300/lPsD10PP4rgUGiGR4CCXA6iY0QQ.jpg',
      description: 'Güneydoğu Asya kültüründen esinlenen büyüleyici bir dünyada, cesur savaşçı Raya\'nın son ejderhayı bulma mücadelesi. Dövüş sahneleri ve mitolojik öğeleriyle sizi bambaşka bir dünyaya taşıyacak!'
    },
    { 
      title: 'Shark Tale',
      imageUrl: 'https://image.tmdb.org/t/p/w300/ireyxvzxdYtGOYX2FyNgzP9NTRD.jpg',
      description: 'Denizaltı mafyası ve gangsterli bir hikaye düşünün - ama kahramanlarımız balıklar! Will Smith\'in seslendirdiği Oscar\'ın başını belaya sokması ve çıkış yolu araması, sizi denizin derinliklerindeki bu komik maceraya çekecek.'
    },
    { 
      title: 'The Croods',
      imageUrl: 'https://image.tmdb.org/t/p/w300/27zvFr4VgE9yCmWJVSr3xaWPZLT.jpg',
      description: 'Tarih öncesi bir aile ile modern düşüncelere sahip bir delikanlının çatışması. Mağara yaşamından çıkıp bilinmeyene adım atan Crood ailesinin eğlenceli macerası, aile bağlarını sorgularken kahkahaya boğacak!'
    },
    { 
      title: 'Lilo & Stitch',
      imageUrl: 'https://image.tmdb.org/t/p/w300/d73UqZWyw3MUMpeaFUnum8L0Mnz.jpg',
      description: 'Hawaii\'de yaşayan küçük bir kız ve uzaylı deneyi arasındaki sıra dışı dostluk! "Ohana ailedir, aile asla terk edilmez" sözüyle hafızanıza kazınacak bu hikaye, sizi hem güldürecek hem duygulandıracak.'
    },
    { 
      title: 'Kubo and the Two Strings',
      imageUrl: 'https://image.tmdb.org/t/p/w300/3Kr9CIIMcXTPlm6cdZ9y3QTe4Y7.jpg',
      description: 'Japon folklorundan esinlenen stop-motion bir başyapıt! Büyülü bir samisenle öyküler anlatan Kubo\'nun babasının zırhını bulmak için çıktığı yolculuk, görsel şölen ve derin anlatımıyla sizi büyüleyecek.'
    },
    { 
      title: 'Abominable',
      imageUrl: 'https://image.tmdb.org/t/p/original/20djTLqppfBx5WYA67Y300S6aPD.jpg',
      description: 'Yi, Yeti\'yi evine götürmek için Çin\'de tehlikeli bir yolculuğa çıkar.'
    },
    { 
      title: 'Spies in Disguise',
      imageUrl: 'https://image.tmdb.org/t/p/original/30YacPAcxpNemhhwX0PVUl9pVA3.jpg',
      description: 'Süper ajan Lance Sterling, bir güvercine dönüştürülür ve genç mucit Walter Beckett ile birlikte çalışmak zorunda kalır.'
    },
    { 
      title: 'The Willoughbys',
      imageUrl: 'https://image.tmdb.org/t/p/original/9WrMmjdZvpxLQh1tCQ9tOd1asOb.jpg',
      description: 'Willoughby kardeşler, ebeveynlerinden kurtulmak için onları tehlikeli bir yolculuğa gönderir.'
    },
    { 
      title: "Ron's Gone Wrong",
      imageUrl: 'https://image.tmdb.org/t/p/original/plzgQAXIEHm4Y92ktxU6fedUc8w.jpg',
      description: 'Barney, arızalı bir robot arkadaş edinir ve onu korumak için mücadele eder.'
    },
    { 
      title: 'A Shaun the Sheep Movie: Farmageddon',
      imageUrl: 'https://image.tmdb.org/t/p/original/p08FoXVFgcRm5QZBaGj0VKa2W2Y.jpg',
      description: 'Shaun ve arkadaşları, uzaylı bir bebeği evine götürmek için maceraya atılır.'
    },
  ],
  special: [
    { 
      title: 'Spider-Man: Into the Spider-Verse',
      imageUrl: 'https://image.tmdb.org/t/p/w300/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg',
      description: 'Örümcek Adam\'ı hiç böyle görmediniz! Çoklu evrenden gelen farklı Örümcek Adam\'ların Miles Morales\'in hayatını değiştirdiği bu görsel şölen, çizgi roman canlandırma tekniğiyle animasyonda çığır açtı. Süper kahraman severler kaçırmasın!'
    },
    { 
      title: 'Up',
      imageUrl: 'https://image.tmdb.org/t/p/w300/vpbaStTMt8qqXaEgnOR2EE4DNJk.jpg',
      description: '78 yaşındaki Carl\'ın evini binlerce balonla uçurduğu inanılmaz macerası! İlk 10 dakikası bile sizi ağlatabilecek bu film, hayallerin peşinden gitmenin her yaşta mümkün olduğunu hatırlatıyor. Duygu yüklü bir başyapıt!'
    },
    { 
      title: 'Your Name (Kimi no Na wa)',
      imageUrl: 'https://image.tmdb.org/t/p/w300/q719jXXEzOoYaps6babgKnONONX.jpg',
      description: 'Birbirini hiç tanımayan iki gencin rüyalarında beden değiştirmesi, anime severlerin başyapıtı olarak kabul ediliyor. Japon kültürü, muhteşem görsellik ve duygusal hikayesiyle zamanın ötesinde bir aşk anlatısı!'
    },
  ],
  rana: [
    { 
      title: 'Sizin Rananız Yok! 🌹',
      imageUrl: 'https://image.tmdb.org/t/p/w300/ghQrKrcEpAlkzBuNoOCSxHQXWqw.jpg',
      description: 'Bu özel koleksiyon, sadece Rana\'sı olanlar için! Eğer bir Rana\'nız yoksa, hayatınızda büyülü ve özel bir şeylerin eksik olduğunu bilin. Ranalı hayat, bambaşka bir deneyim! 💝'
    },
  ],
};

// Film verileri için görsel kaynağı
const getMovieImage = (title: string, index: number, section: string = '') => {
  // Film adına göre poster URL'sini belirle
  const filmPosters: Record<string, string> = {
    // İzlediklerim bölümü
    'Toy Story Serisi': 'https://m.media-amazon.com/images/M/MV5BMDU2ZWJlMjktMTRhMy00ZTA5LWEzNDgtYmNmZTEwZTViZWJkXkEyXkFqcGdeQXVyNDQ2OTk4MzI@._V1_.jpg',
    'Kung Fu Panda Serisi': 'https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p170977_p_v8_az.jpg',
    'Madagaskar Serisi': 'https://m.media-amazon.com/images/M/MV5BZTY3YzZhY2QtYTY5ZC00ZTY4LWFkM2QtODRmMGJmOThjYmYwXkEyXkFqcGdeQXVyMTEwODg2MDY@._V1_.jpg',
    'Zootopia': 'https://resizing.flixster.com/QIoVbPhKJHgbeJ1FGXgImVEEkBk=/v3/t/assets/p12575562_p_v10_aa.jpg',
    'Big Hero 6': 'https://lumiere-a.akamaihd.net/v1/images/p_bighero6_19753_20bd6206.jpeg',
    'Cars Serisi': 'https://lumiere-a.akamaihd.net/v1/images/p_cars_19643_4edd6068.jpeg',
    'How to Train Your Dragon Serisi': 'https://m.media-amazon.com/images/M/MV5BMjA5NDQyMjc2NF5BMl5BanBnXkFtZTcwMjg5ODcyMw@@._V1_.jpg',
    'The Incredibles Serisi': 'https://m.media-amazon.com/images/M/MV5BMTY5OTU0OTc2NV5BMl5BanBnXkFtZTcwMzU4MDcyMQ@@._V1_.jpg',
    'Monsters, Inc.': 'https://m.media-amazon.com/images/M/MV5BMTY1NTI0ODUyOF5BMl5BanBnXkFtZTgwNTEyNjQ0MDE@._V1_.jpg',
    'WALL·E': 'https://lumiere-a.akamaihd.net/v1/images/p_walle_19753_63bf7c27.jpeg',
    'Finding Nemo': 'https://m.media-amazon.com/images/M/MV5BZTAzNWZlNmUtZDEzYi00ZjA5LWIwYjEtZGM1NWE1MjE4YWRhXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
    'Moana': 'https://m.media-amazon.com/images/M/MV5BMjI4MzU5NTExNF5BMl5BanBnXkFtZTgwNzY1MTEwMDI@._V1_.jpg',
    'Turning Red': 'https://lumiere-a.akamaihd.net/v1/images/p_turningred_22797_1_c17f32af.jpeg',
    'Inside Out': 'https://lumiere-a.akamaihd.net/v1/images/p_insideout_19751_af12286c.jpeg',
    'Elemental': 'https://m.media-amazon.com/images/M/MV5BZjYxYWVjMDMtZGRjZS00ZDE4LTk0OWUtMjUyOTI4MmYxNTNjXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg',
    'Soul': 'https://m.media-amazon.com/images/M/MV5BZGE1MDg5M2MtNTkyZS00MTY5LTg1YjAtZTlhZmM1Y2EwNmFmXkEyXkFqcGdeQXVyNjA3OTI0MDc@._V1_.jpg',
    'Onward': 'https://lumiere-a.akamaihd.net/v1/images/p_onward_19723_dbb512cb.jpeg',
    'Brave': 'https://lumiere-a.akamaihd.net/v1/images/p_brave_20488_9e833e2b.jpeg',
    'Puss in Boots: The Last Wish': 'https://m.media-amazon.com/images/M/MV5BNjMyMDBjMGUtNDUzZi00N2MwLTg1MjItZTk2MDE1OTZmNTYxXkEyXkFqcGdeQXVyMTQ5NjA0NDM0._V1_.jpg',
    'Despicable Me Serisi': 'https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p7597_p_v8_az.jpg',
    'Frozen Serisi': 'https://lumiere-a.akamaihd.net/v1/images/p_frozen_18373_3131259c.jpeg',
    'Tangled': 'https://lumiere-a.akamaihd.net/v1/images/p_tangled_20509_cd0a5809.jpeg',
    'The Mitchells vs. The Machines': 'https://upload.wikimedia.org/wikipedia/en/6/64/The_Mitchells_vs._the_Machines_film_poster.jpg',
    'Cloudy with a Chance of Meatballs': 'https://m.media-amazon.com/images/M/MV5BMTg0MjAwNDI5MV5BMl5BanBnXkFtZTcwODkyMzg2Mg@@._V1_.jpg',
    'Wreck-It Ralph': 'https://lumiere-a.akamaihd.net/v1/images/p_wreckitralph_19473_20a822f4.jpeg',
    'Megamind': 'https://m.media-amazon.com/images/M/MV5BMTAzMzI0NTMzNDBeQTJeQWpwZ15BbWU3MDM3NTAyOTM@._V1_.jpg',
    'The Lego Movie': 'https://m.media-amazon.com/images/M/MV5BMTg4MDk1ODExN15BMl5BanBnXkFtZTgwNzIyNjg3MDE@._V1_.jpg',
    'Encanto': 'https://m.media-amazon.com/images/M/MV5BNjE5NzA4ZDctOTJkZi00NzM0LTkwOTYtMDI4MmNkMzIxODhkXkEyXkFqcGdeQXVyNjY1MTg4Mzc@._V1_.jpg',
    'Luca': 'https://m.media-amazon.com/images/M/MV5BZTQyNDQwNTQtMTUxMy00ZTdmLWI5ODEtMjE5MzI4NmU5MmQ5XkEyXkFqcGdeQXVyMTA1OTcyNDQ4._V1_.jpg',
    'Monsters University': 'https://lumiere-a.akamaihd.net/v1/images/p_monstersuniversity_20135_3f2af2bf.jpeg',
    'Sing': 'https://m.media-amazon.com/images/M/MV5BMTYzODYzODU2Ml5BMl5BanBnXkFtZTgwNTc1MTA2NzE@._V1_.jpg',
    'Minions': 'https://m.media-amazon.com/images/M/MV5BMTg2MTMyMzU0M15BMl5BanBnXkFtZTgwOTU3ODk4NTE@._V1_.jpg',
    'Rango': 'https://m.media-amazon.com/images/M/MV5BMTc4NjEyODE1OV5BMl5BanBnXkFtZTcwMjYzNTkxNA@@._V1_.jpg',
    'Flushed Away': 'https://m.media-amazon.com/images/M/MV5BMTI1MzE1MDk2N15BMl5BanBnXkFtZTYwMjEwMzI3._V1_.jpg',
    'Robots': 'https://m.media-amazon.com/images/M/MV5BZmJhNTQwY2MtYTU0Yy00MjY5LTk5YWMtZTdiMDFlNmZhNWI4XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
    "Surf's Up": 'https://m.media-amazon.com/images/M/MV5BMjE4NDE3NzcwM15BMl5BanBnXkFtZTcwMTI0ODYzMw@@._V1_.jpg',
    'The Peanuts Movie': 'https://m.media-amazon.com/images/M/MV5BNTE5NzMxNzkwNl5BMl5BanBnXkFtZTgwOTQ0Nzk5NzE@._V1_.jpg',
    'The Angry Birds Movie': 'https://m.media-amazon.com/images/M/MV5BMTY3MjU0NDA0OF5BMl5BanBnXkFtZTgwNTc0MTU3OTE@._V1_.jpg',
    'Epic': 'https://m.media-amazon.com/images/M/MV5BMTgyNDYwNzQ3OV5BMl5BanBnXkFtZTcwMzUyODM5OA@@._V1_.jpg',
    'The Good Dinosaur': 'https://lumiere-a.akamaihd.net/v1/images/p_thegooddinosaur_19754_63ae22a0.jpeg',
    
    // Depo (İzleyeceklerim) bölümü
    'Raya and the Last Dragon': 'https://m.media-amazon.com/images/M/MV5BZWNiOTc4NGItNGY4YS00ZGNkLThkOWEtMDE2ODcxODEwNjkwXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg',
    'Shark Tale': 'https://m.media-amazon.com/images/M/MV5BMTMxMjY0NzE2M15BMl5BanBnXkFtZTcwNTc3ODcyMQ@@._V1_.jpg',
    'The Croods': 'https://m.media-amazon.com/images/M/MV5BMTcyOTc2OTA1Ml5BMl5BanBnXkFtZTcwOTI1MjkzOQ@@._V1_.jpg',
    'Lilo & Stitch': 'https://m.media-amazon.com/images/M/MV5BMTkwOTU5MTA2M15BMl5BanBnXkFtZTYwMjYyNzk2._V1_.jpg',
    'Kubo and the Two Strings': 'https://m.media-amazon.com/images/M/MV5BMjA2Mzg2NDMzNl5BMl5BanBnXkFtZTgwMjcwODUzOTE@._V1_.jpg',
    'Abominable': 'https://m.media-amazon.com/images/M/MV5BMTYzMDM4NzkxOV5BMl5BanBnXkFtZTgwNzM1Mzg2NzM@._V1_.jpg',
    'Spies in Disguise': 'https://m.media-amazon.com/images/M/MV5BNzg1MzM3OWUtNjgzZC00NjMzLWE1NzAtOThiMDgyMjhhZDBhXkEyXkFqcGdeQXVyODkzNTgxMDg@._V1_.jpg',
    'The Willoughbys': 'https://m.media-amazon.com/images/M/MV5BYWQyYWMzYTctMTdkMy00ODk5LWFiZDQtOTNhOTY0OTI2NWNmXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg',
    "Ron's Gone Wrong": 'https://m.media-amazon.com/images/M/MV5BOTNmZGU4MGYtNzllMC00MzU1LWJiMjQtNDYxNjA5ZWEyMzVkXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg',
    'A Shaun the Sheep Movie: Farmageddon': 'https://m.media-amazon.com/images/M/MV5BYTVjYWJmMWQtYWU4Ni00MWJiLWIwYzktODg2YTVkN2Q4YjhmXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg',

    // Özel Seçimler bölümü
    'Spider-Man: Into the Spider-Verse': 'https://m.media-amazon.com/images/M/MV5BMjMwNDkxMTgzOF5BMl5BanBnXkFtZTgwNTkwNTQ3NjM@._V1_.jpg',
    'Up': 'https://m.media-amazon.com/images/M/MV5BMTk3NDE2NzI4NF5BMl5BanBnXkFtZTgwNzE1MzEyMTE@._V1_.jpg',
    'Your Name (Kimi no Na wa)': 'https://m.media-amazon.com/images/M/MV5BNGYyNmI3M2YtNzYzZS00OTViLTkxYjAtZDIyZmE1NTUyMzljXkEyXkFqcGdeQXVyMTA4NjE0NjEy._V1_.jpg',

    // Rana bölümü
    'Sizin Rananız Yok! 🌹': 'https://media.istockphoto.com/id/1388253782/photo/wilted-and-dried-red-rose-flower-closeup-on-black-background.jpg?s=612x612&w=0&k=20&c=2-jucs6Ng0_ZCdXefcyGq92BGm1JnZ5VpP-PO3gCJ_E=',
  };

  // Eğer film ismi poster listesinde varsa onu kullan, yoksa varsayılan poster
  if (filmPosters[title]) {
    return filmPosters[title];
  }
  
  // Varsayılan poster - eğer listede film bulunamazsa
  return `https://picsum.photos/seed/${title.toLowerCase().replace(/\s+/g, '')}/400/600`;
};

// Bir diziyi karıştırma fonksiyonu
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Tüm filmleri geç ve resim URL'lerini düzelt
const updateImageUrls = () => {
  Object.keys(movies).forEach((section) => {
    movies[section as keyof typeof movies].forEach((movie, index) => {
      // Gerçek film posteri ata
      movie.imageUrl = getMovieImage(movie.title, index, section);
    });
  });
};

// Görsel URL'lerini güncelle
updateImageUrls();

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>('watched');
  const [watchedMovieTitles, setWatchedMovieTitles] = useState<string[]>([]);
  const [displayedMovies, setDisplayedMovies] = useState(movies[activeSection]);

  // İzlenen filmleri yükle
  useEffect(() => {
    setWatchedMovieTitles(getWatchedMovies());
  }, []);

  // İzlenen filmler değiştiğinde ekranı güncelle
  const updateWatchedMovies = () => {
    setWatchedMovieTitles(getWatchedMovies());
  };

  // Bölüm değiştiğinde veya izleme filtresi değiştiğinde filmleri güncelle
  useEffect(() => {
    let moviesToShow = [...movies[activeSection]];
    
    // İzlenen filmleri üstte göster (Rana bölümü hariç)
    if (activeSection !== 'rana') {
      // Önce hangi filmlerin izlendiğini belirle
      const watchedMovies = moviesToShow.filter(movie => 
        watchedMovieTitles.includes(movie.title)
      );
      
      // Sonra izlenmemiş filmleri belirle
      const unwatchedMovies = moviesToShow.filter(movie => 
        !watchedMovieTitles.includes(movie.title)
      );
      
      // İzlenen filmleri üstte, izlenmeyenleri altta göster
      moviesToShow = [...watchedMovies, ...unwatchedMovies];
    }
    
    setDisplayedMovies(moviesToShow);
  }, [activeSection, watchedMovieTitles]);

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-blue-950 to-orange-900/10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 text-transparent bg-clip-text">
          Animasyon Film Koleksiyonu
        </h1>

        {/* Bölüm butonları */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
          {sections.map((section) => (
            <SectionButton
              key={section.id}
              title={section.title}
              onClick={() => {
                setActiveSection(section.id);
              }}
              isActive={activeSection === section.id}
              color={section.color}
            />
          ))}
        </div>

        {/* Film kartları - responsive grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Rana bölümü için normal gösterim */}
            {activeSection === 'rana' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayedMovies.map((movie) => (
                  <MovieCard
                    key={movie.title}
                    title={movie.title}
                    imageUrl={movie.imageUrl}
                    description={movie.description}
                    isRanaSection={true}
                    onWatchedStatusChange={updateWatchedMovies}
                  />
                ))}
              </div>
            ) : (
              <>
                {/* İzlenen filmler bölümü */}
                {displayedMovies.filter(movie => watchedMovieTitles.includes(movie.title)).length > 0 && (
                  <>
                    <div className="flex items-center gap-2 mb-4">
                      <h2 className="text-xl font-bold text-green-400">İzlediğiniz Filmler</h2>
                      <div className="flex-1 h-0.5 bg-green-500/30 rounded"></div>
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm">
                        {displayedMovies.filter(movie => watchedMovieTitles.includes(movie.title)).length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {displayedMovies
                        .filter(movie => watchedMovieTitles.includes(movie.title))
                        .map((movie) => (
                          <MovieCard
                            key={movie.title}
                            title={movie.title}
                            imageUrl={movie.imageUrl}
                            description={movie.description}
                            isRanaSection={false}
                            onWatchedStatusChange={updateWatchedMovies}
                          />
                        ))}
                    </div>
                  </>
                )}

                {/* İzlenmeyen filmler bölümü */}
                {displayedMovies.filter(movie => !watchedMovieTitles.includes(movie.title)).length > 0 && (
                  <>
                    <div className="flex items-center gap-2 mt-8 mb-4">
                      <h2 className="text-xl font-bold text-blue-300">Keşfedilmemiş Filmler</h2>
                      <div className="flex-1 h-0.5 bg-blue-500/30 rounded"></div>
                      <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
                        {displayedMovies.filter(movie => !watchedMovieTitles.includes(movie.title)).length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {displayedMovies
                        .filter(movie => !watchedMovieTitles.includes(movie.title))
                        .map((movie) => (
                          <MovieCard
                            key={movie.title}
                            title={movie.title}
                            imageUrl={movie.imageUrl}
                            description={movie.description}
                            isRanaSection={false}
                            onWatchedStatusChange={updateWatchedMovies}
                          />
                        ))}
                    </div>
                  </>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
} 