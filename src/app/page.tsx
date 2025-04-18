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
  // Film adının ilk harfini kullan
  const charCode = title.charCodeAt(0) || 65;
  const index_offset = index * 37; // Her film için farklı bir renk tonu
  const hue = (charCode * 137 + index_offset) % 360;
  const sat = 70 + (index % 20); // Renk doygunluğunu biraz değiştir
  
  // Kategoriye göre renk şemaları
  let colorScheme = '';
  if (section === 'rana') {
    colorScheme = 'ff6b96,ff8fab'; // Pembe tonları
  } else if (section === 'special') {
    colorScheme = '9333ea,a855f7'; // Mor tonları
  } else if (section === 'explore') {
    colorScheme = 'f59e0b,fbbf24'; // Amber tonları
  } else {
    colorScheme = '0ea5e9,38bdf8'; // Mavi tonları
  }
  
  // Film adını URL için güvenli hale getir
  const encodedTitle = encodeURIComponent(title);
  
  // Güvenilir ve hızlı bir görsel servis kullanarak güzel posterler oluştur
  return `https://placehold.co/400x600/gradient/${colorScheme}?text=${encodedTitle}`;
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
      // Kategori bazlı görsel ata
      movie.imageUrl = getMovieImage(movie.title, index, section);
    });
  });
};

// Görsel URL'lerini güncelle
updateImageUrls();

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>('watched');
  const [showOnlyWatched, setShowOnlyWatched] = useState(false);
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
    
    // Rastgele sırala - sadece watched filtrelemesi açık değilse
    if (!showOnlyWatched) {
      moviesToShow = shuffleArray(moviesToShow);
    } 
    // Sadece izlenen filmleri göster
    else if (activeSection !== 'rana') {
      moviesToShow = moviesToShow.filter(movie => 
        watchedMovieTitles.includes(movie.title)
      );
    }
    
    setDisplayedMovies(moviesToShow);
  }, [activeSection, showOnlyWatched, watchedMovieTitles]);

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
                setShowOnlyWatched(false); // Bölüm değiştiğinde filtreyi sıfırla
              }}
              isActive={activeSection === section.id}
              color={section.color}
            />
          ))}
        </div>

        {/* Filtre butonu - Rana bölümü hariç gösterilir */}
        {activeSection !== 'rana' && (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowOnlyWatched(!showOnlyWatched)}
              className={`
                px-4 py-2 rounded-lg font-medium flex items-center gap-2
                transition-colors duration-200
                ${showOnlyWatched 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }
              `}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Sadece İzlediklerimi Göster
            </button>
          </div>
        )}

        {/* Film kartları - responsive grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeSection}-${showOnlyWatched}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {displayedMovies.map((movie) => (
              <MovieCard
                key={movie.title}
                title={movie.title}
                imageUrl={movie.imageUrl}
                description={movie.description}
                isRanaSection={activeSection === 'rana'}
                onWatchedStatusChange={updateWatchedMovies}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
} 