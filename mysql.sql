CREATE TABLE `jiandan_image` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `image` varchar(100) DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `retry_times` tinyint(4) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `error_message` varchar(50) DEFAULT '',
  `number` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `update_at` (`updated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `jiandan_crawl` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `date` varchar(50) DEFAULT NULL,
  `number` int(11) DEFAULT NULL,
  `images` text,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;