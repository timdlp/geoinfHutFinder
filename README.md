# geoinfHutFinder
Projet final pour le cours géoInformation du dpt comem+ à la HEIG-VD.

## Informations fournies par l'enseignant

Objectifs :
1. Localisation d'un lieu sur une carte par une recherche basée sur le nom
2. Affichage et interaction avec les cabanes de montagne dans un périmètre de 10km autour de ce lieu

Ressources :
* l'API de géocodage proposé par Mapbox : https://www.mapbox.com/api-documentation/#geocoding
* les géodonnées des cabanes : [world_cabanes.zip](http://mediamaps.ch/lib/exe/fetch.php?media=geoinf17:world_cabanes.zip)

## Introduction
Ce projet complète notre évaluation dans le cadre du cours GéoInformation donné aux étudiants de 3ème année du Département COMEM+ de la HEIG-VD. Après une évaluation individuel, ce projet est réalisé par groupe.

L'objectif de cette application web est de fournir les cabanes de montagne se trouvant dans un rayon de 10km autour d'un lieu saisi par l'utilisateur. De plus, il est nécessaire de pouvoir intéragir avec une cabane afin d'avoir des informations complémentaires sur celle-ci.


## Démarche
Voici les étapes réalisées pour la mise en place du projet.

1. Identifier le fonctionnement de l'API de géocodage de Mapbox.
2. Choisir un moyen de rendre les données concernant les cabanes.
3. Câbler le tout ensemble
4. Tester et corriger les erreurs éventuelles

*Nous avons principalement travaillé à deux derrière un seul écran, c'est pourquoi le nombre de commits n'est pas forcément équivalent entre les deux contributeurs. L'idée était de se voir pour avancer et de solutionner les problèmes à deux.*

### 1. Fonctionnement de l'API Mapbox
Concernant le premier point, nous avons suivi les indications proposées dans la documentation de l'API Mapbox et avons rapidement saisi le fonctionnement du service.

### 2. Système maison pour rendre les cabanes
Par la suite, nous avons opté pour un système "maison" avec PostGIS sur le serveur pingouin (serveur de développement pour les étudiants COMEM+). À ce moment, nous avons du transformer les données fournies par l'enseignant pour qu'elles soient dans un SCR adapté à l'affichage web et surtout adapté pour le calcul de distance. Notre choix s'est porté sur l'EPSG:3857 qui a l'avantage de présenter les distance en mètres, ce qui est très pratique pour calculer les cabanes dans un rayon donné.

Côté serveur, nous avons adapté les fichiers proposés dans le cours pour rendre les features en JSON. 


## Solutions retenues


## Conclusion

## Sources, webographie, librairies utilisées

https://stackoverflow.com/questions/27791801/how-to-get-city-state-country-for-mapbox-using-reverse-geocoding#27792010
