insert into location values(1, 'shelf');
insert into location values(2, 'rack-1');
insert into location values(3, 'rack-2');
insert into location values(4, 'another shelf');

insert into role values(1, 'Staff');
insert into role values(2, 'Student');
insert into role values(3, 'Faculty');

insert into tag values(1, 'Networking Equipment');
insert into tag values(2, 'Computer Accessories');
insert into tag values(3, 'test-tag');
insert into tag values(4, 'Long-Term');
insert into tag values(5, 'iPhone');
insert into tag values(6, 'Cables');

insert into user values(1, 'shawn', 'test-type', 'test-pw', 'sxx6945@rit.edu', 1);
insert into user values(2, 'testuser', 'test-type', 'test-pw', '----@gmail.com', 1);
insert into user values(3, 'sarah', 'test-type', 'test-pw', '----@gmail.com', 2);
insert into user values(4, 'kevin', 'test-type', 'test-pw', '----@gmail.com', 2);
insert into user values(5, 'prof1', 'type', 'test-pw', '----@gmail.com', 3);
insert into user values(6, 'mike', 'test-type', 'test-pw', '----@gmail.com', 3);

insert into item values(1, 'name', 'test_type', 'des', 'version', 0, 1);
insert into item values(2, 'Laptop', 'Computer', 'This is a laptop', 'version', 1, 2);
insert into item values(3, 'Mouse', 'Peripherals', 'Just a mouse', 'version', 0, 1);
insert into item values(4, 'Keyboard', 'Peripherals', 'A good keyboard', 'version', 0, 1);
insert into item values(5, 'another keyboard', 'Peripherals', 'A very good keyboard', 'version', 0, 2);
insert into item values(6, 'USB drive', 'Hardware', 'Just a regular usb drive', 'version', 0, 1);
insert into item values(7, 'CAT6 Patch Cable', 'Hardware', 'An ethernet cable', 'version', 0, 2);
insert into item values(8, 'Crossover Cable', 'Hardware', 'Red router cable', 'version', 0, 2);
insert into item values(9, 'iPhone X', 'Mobile Device', 'iPhone X Smartphone for Development purposes', 'version', 1, 3);
insert into item values(10, 'iPhone 11', 'Mobile Device', 'iPhone 11 Smartphone for Development purposes', 'version', 0, 3);
insert into item values(11, 'USB Type C cable', 'Hardware', 'An interesting type C cable', 'version', 0, 1);

insert into item_tag values(1, 2, 4);
insert into item_tag values(2, 3, 2);
insert into item_tag values(3, 4, 2);
insert into item_tag values(4, 5, 2);
insert into item_tag values(5, 6, 2);
insert into item_tag values(6, 7, 1);
insert into item_tag values(7, 8, 1);
insert into item_tag values(8, 9, 5);
insert into item_tag values(9, 9, 4);
insert into item_tag values(10, 10, 5);
insert into item_tag values(11, 10, 4);
insert into item_tag values(12, 11, 2);
insert into item_tag values(13, 7, 6);
insert into item_tag values(14, 8, 6);
insert into item_tag values(15, 11, 6);

insert into reservation values(1, 1, '2022-02-19 12:00:00', '2022-03-01 13:00:00');
insert into reservation values(2, 1, '2022-02-01 15:00:00', '2022-02-10 16:00:00');
insert into reservation values(3, 2, '2022-02-21 15:30:00', '2022-02-22 16:30:00');

insert into reservation_item values(1, 4, 1);
insert into reservation_item values(2, 3, 1);
insert into reservation_item values(3, 2, 2);
insert into reservation_item values(4, 8, 3);

insert into kit values(1, 'test-kit', 5, 'a test kit', 20, 0, 4);

insert into item_kit values(1, 2, 1);
insert into item_kit values(2, 3, 1);