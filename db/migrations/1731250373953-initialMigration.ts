import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1731250373953 implements MigrationInterface {
  name = 'InitialMigration1731250373953';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO record (name, author, price, description, releaseDate, userId)
VALUES
    ('Abbey Road', 'The Beatles', 29.99, 'Classic album by The Beatles, released in 1969.', '1969-09-26', 1),
    ('Dark Side of the Moon', 'Pink Floyd', 34.99, 'Iconic album exploring themes of conflict, greed, and mental illness.', '1973-03-01', 1),
    ('Back in Black', 'AC/DC', 27.50, 'One of the best-selling albums of all time by AC/DC.', '1980-07-25', 1),
    ('Rumours', 'Fleetwood Mac', 25.99, 'Fleetwood Mac''s legendary album with hits like "Dreams" and "Go Your Own Way".', '1977-02-04', 1),
    ('Thriller', 'Michael Jackson', 32.99, 'Record-breaking album with iconic songs like "Thriller" and "Beat It".', '1982-11-30', 1),
    ('The Wall', 'Pink Floyd', 35.00, 'A rock opera album by Pink Floyd, dealing with isolation and mental breakdown.', '1979-11-30', 1),
    ('Hotel California', 'Eagles', 28.00, 'Classic rock album with hits like "Hotel California".', '1976-12-08', 1),
    ('Nevermind', 'Nirvana', 26.99, 'Nirvana''s groundbreaking album that brought grunge to the mainstream.', '1991-09-24', 1),
    ('Led Zeppelin IV', 'Led Zeppelin', 29.50, 'Features timeless classics like "Stairway to Heaven".', '1971-11-08', 1),
    ('The Joshua Tree', 'U2', 27.00, 'U2''s critically acclaimed album with hits like "With or Without You".', '1987-03-09', 1),
    ('Born to Run', 'Bruce Springsteen', 24.99, 'An album that established Bruce Springsteen as a superstar.', '1975-08-25', 1),
    ('A Night at the Opera', 'Queen', 30.99, 'Contains "Bohemian Rhapsody" and other iconic tracks by Queen.', '1975-11-21', 1),
    ('Purple Rain', 'Prince', 31.99, 'Prince''s album and movie soundtrack that cemented his status as a superstar.', '1984-06-25', 1),
    ('Goodbye Yellow Brick Road', 'Elton John', 28.99, 'A double album featuring hits like "Candle in the Wind".', '1973-10-05', 1),
    ('Appetite for Destruction', 'Guns N'' Roses', 27.50, 'Debut album by Guns N'' Roses with songs like "Sweet Child O'' Mine".', '1987-07-21', 1),
    ('Graceland', 'Paul Simon', 26.99, 'Award-winning album influenced by South African music.', '1986-08-25', 1),
    ('The Chronic', 'Dr. Dre', 24.99, 'A pioneering album in West Coast hip-hop.', '1992-12-15', 1),
    ('OK Computer', 'Radiohead', 32.99, 'Radiohead''s critically acclaimed exploration of modern alienation.', '1997-05-21', 1),
    ('The Beatles (White Album)', 'The Beatles', 33.99, 'A double album by The Beatles with a range of eclectic tracks.', '1968-11-22', 1),
    ('Blonde on Blonde', 'Bob Dylan', 29.99, 'A landmark double album by Bob Dylan.', '1966-05-16', 1),
    ('Pet Sounds', 'The Beach Boys', 31.00, 'Revolutionary album with lush orchestration and complex harmonies.', '1966-05-16', 1),
    ('Sgt. Pepper''s Lonely Hearts Club Band', 'The Beatles', 30.00, 'A concept album that changed pop music.', '1967-05-26', 1),
    ('London Calling', 'The Clash', 28.50, 'One of the greatest punk rock albums, incorporating various styles.', '1979-12-14', 1);

    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM record WHERE name IN (
        'Abbey Road', 'Dark Side of the Moon', 'Back in Black', 'Rumours', 'Thriller', 
        'The Wall', 'Hotel California', 'Nevermind', 'Led Zeppelin IV', 'The Joshua Tree',
        'Born to Run', 'A Night at the Opera', 'Purple Rain', 'Goodbye Yellow Brick Road',
        'Appetite for Destruction', 'Graceland', 'The Chronic', 'OK Computer', 
        'The Beatles (White Album)', 'Blonde on Blonde', 'Pet Sounds', 
        'Sgt. Pepper''s Lonely Hearts Club Band', 'London Calling'
      );
    `);
  }
}
