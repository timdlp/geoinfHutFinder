# geoinfHutFinder
Projet final pour le cours géoInformation du département COMEM+ à la HEIG-VD.

## Informations fournies par l'enseignant

Objectifs :
1. Localisation d'un lieu sur une carte par une recherche basée sur le nom
2. Affichage et interaction avec les cabanes de montagne dans un périmètre de 10km autour de ce lieu

Ressources :
* l'API de géocodage proposé par Mapbox : https://www.mapbox.com/api-documentation/#geocoding
* les géodonnées des cabanes : [world_cabanes.zip](http://mediamaps.ch/lib/exe/fetch.php?media=geoinf17:world_cabanes.zip)

## Introduction
Ce projet complète notre évaluation dans le cadre du cours GéoInformation donné aux étudiants de 3e année du Département COMEM+ de la HEIG-VD. Après une évaluation individuelle, ce projet est réalisé en groupe.

L'objectif de cette application web est de fournir les cabanes de montagne se trouvant dans un rayon de 10km autour d'un lieu saisi par l'utilisateur. De plus, il est nécessaire de pouvoir interagir avec une cabane afin d'obtenir des informations complémentaires sur cette dernière.

Notre application est disponible à l’adresse : http://hutfinder.delapier.re, le dépôt Github est à l’adresse suivante : https://github.com/timdlp/geoinfHutFinder

## Démarche

*Nous avons principalement travaillé à deux derrière un seul écran, c'est pourquoi le nombre de commits n'est pas forcément équivalent entre les deux contributeurs. L'idée était de se voir pour avancer et de solutionner les problèmes éventuels à deux.*

Voici les étapes réalisées pour la mise en place du projet.

1. Identifier le fonctionnement de l'API de géocodage de Mapbox.
2. Choisir un moyen de rendre les données concernant les cabanes.
3. Câbler le tout ensemble
4. Tester et corriger les erreurs éventuelles


### 1. Fonctionnement de l'API Mapbox
Concernant le premier point, nous avons suivi les indications proposées dans la documentation de l'API Mapbox et avons rapidement saisi le fonctionnement du service. Le choix a été fait d'afficher sur la carte le premier résultat fourni par Mapbox et de lister les autres en dessous du champ de recherche en cas de multiples résultats.

### 2. Système maison pour rendre les cabanes
Par la suite, nous avons opté pour un système "maison" avec PostGIS sur le serveur pingouin (serveur de développement pour les étudiants COMEM+). À ce moment, nous avons dû transformer les données fournies par l'enseignant pour qu'elles soient dans un SCR adapté à l'affichage web et surtout adapté pour le calcul de distance. Notre choix s'est porté sur l'EPSG:3857 qui a l'avantage de présenter les distance en mètres, ce qui est très pratique pour calculer les cabanes dans un rayon donné.

Côté serveur, nous avons adapté les fichiers proposés durant le cours pour rendre les cabanes sous la forme d'un GeoJSON. Les scripts modifiés sont disponibles dans le dossier server-side du repository GitHub. Le service reçoit une coordonnée X et une coordonnée Y en EPSG:3857 et retourne les cabanes dans un rayon de 10km, il renvoie également la distance entre le point fourni et la cabane.

Nous avions commencé à travailler sur la possibilité de personnaliser le rayon dans lequel trouver les cabanes, mais cette fonctionnalité a été abandonnée au profit du reste de l'application. Nous avions également initialement pensé faire une version responsive de notre application, elle aussi abandonnée en raison du temps à disposition.

### 3. Mise en œuvre de la solution

Une fois le service en place, les interactions sont très simplifiées. Nous créons une carte en fournissant une coordonnée arbitraire ainsi qu'un niveau de zoom au chargement de la page. Par la suite, l'utilisateur saisit le lieu de sa recherche et le premier résultat est affiché dans la carte (marqueur vert). Ici on peut interagir avec les résultats de la recherche. Parallèlement, une recherche est effectuée d'après les coordonnées du lieu via notre WebService maison et les cabanes dans un rayon de 10km sont renvoyées et affichées sur la carte (marqueur rose). Elles sont également listées en dessous des résultats de recherche du lieu.

On peut interagir en cliquant sur les cabanes sur la carte ou depuis la liste.

## Conclusion

La réalisation de ce projet nous a permis de nous familiariser avec l’API de Géocodage de Mapbox, avec l’extension de PostgreSQL PostGIS ainsi qu’avec les fonctionnalités de la bibliothèque OpenLayers (version 4.6.4)

Il y a bien évidemment toujours des fonctionnalités supplémentaires que nous pourrions implémenter, voici quelques perspectives à prendre en compte comme premières étapes pour arriver à une application finalisée :

- Il faudrait avoir un retour en cas d’erreur de géocodage (si aucun lieu n’est trouvé)
- Il faudrait avoir une notification si aucune cabane n’est disponible dans un rayon de 10km autour d’un lieu. Actuellement, aucune donnée n’est affichée, mais il n’y a pas explicitement de message indiquant ce fait à l’utilisateur.
- On pourrait encore améliorer la structure du code et l’aspect général de l’application

Nous sommes néanmoins satisfaits de l’état actuel du projet qui répond au cahier des charges demandé par l’enseignant


## Sources, webographie, librairies utilisées

### Bibliothèques et extensions
- Mapbox JS SDK : https://github.com/mapbox/mapbox-sdk-js
- OpenLayers : http://openlayers.org/en/latest/apidoc/
- PostGIS : http://postgis.net/documentation/
- jQuery : https://api.jquery.com/
- Modernizr : https://modernizr.com/

### Ressources consultées et utilisées
- City, state for Mapbox : https://stackoverflow.com/questions/27791801/how-to-get-city-state-country-for-mapbox-using-reverse-geocoding#27792010
- Openlayers Overlay :
http://openlayers.org/en/latest/examples/overlay.html?q=click
