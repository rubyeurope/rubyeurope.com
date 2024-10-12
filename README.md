# Ruby Europe

Repository used for Ruby Europe site

Production at: https://rubyeurope.com


## Contributing Changes

As an open-source project hosted on GitHub at rubyeurope/rubyeurope.com, we welcome contributions, especially for updating information about local Ruby meetups and conferences. The `db/seeds.rb` file is used to populate the database with each deployment, so put new meetups and conferences there.

An example Pull Request: https://github.com/rubyeurope/rubyeurope.com/pull/1

Here's how to contribute:

1. Fork the repository and create your feature branch:
   ```
   git checkout -b my-new-feature
   ```

2. For new meetups or conferences:
   - Add the event logo to the `public/logos` folder. Name it consistently with existing logos.
   - Update `db/seeds.rb` with the new event information.

3. Make your changes in the relevant files.

4. Commit your changes:
   ```
   git commit -am 'Add some content'
   ```

5. Push to the branch:
   ```
   git push origin my-new-feature
   ```

6. Create a new Pull Request.

## Local Installation

Follow these steps to set up the project locally:

1. Clone the repository:
   ```
   git clone https://github.com/rubyeurope/ruby-europe.git
   cd ruby-europe
   ```

2. Install Ruby dependencies:
   ```
   bundle install
   ```

3. Set up the database:
   - Copy the example environment file:
     ```
     cp .env.development.example .env.development
     ```
   - Edit `.env.development` and set your database credentials:
     ```
     DB_USERNAME=your_username
     DB_PASSWORD=your_password
     ```
   - Create database, run migrations and seed data:
     ```
     rails db:setup
     ```

4. Start the Rails server:
   ```
   bin/dev # use to enable tailwind and hot reload
   ```

5. Visit `http://localhost:3000` or `http://0.0.0.0:3000` in your web browser to see the application running (Google maps won't work otherwise).
