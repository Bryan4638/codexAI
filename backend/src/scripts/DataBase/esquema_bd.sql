--
-- PostgreSQL database dump
--

\restrict rwDxq68K91nrt8qKl8cIlnP5Y8aTbWnzz5g9Vowv7ajK9TAvsAsu43yjTVymnN7

-- Dumped from database version 17.7
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: exercises_difficulty_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.exercises_difficulty_enum AS ENUM (
    'beginner',
    'intermediate',
    'advanced'
);


ALTER TYPE public.exercises_difficulty_enum OWNER TO postgres;

--
-- Name: exercises_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.exercises_type_enum AS ENUM (
    'code',
    'quiz',
    'dragDrop',
    'fillBlank'
);


ALTER TYPE public.exercises_type_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: challenge_tests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.challenge_tests (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    description character varying NOT NULL,
    input text,
    expected_output text NOT NULL,
    is_hidden boolean DEFAULT false NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    challenge_id uuid
);


ALTER TABLE public.challenge_tests OWNER TO postgres;

--
-- Name: challenges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.challenges (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying NOT NULL,
    description character varying NOT NULL,
    initial_code character varying NOT NULL,
    difficulty character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    author_id uuid NOT NULL,
    test_cases jsonb DEFAULT '[]'::jsonb NOT NULL
);


ALTER TABLE public.challenges OWNER TO postgres;

--
-- Name: email_codes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.email_codes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    "codeHash" character varying NOT NULL,
    "expiresAt" timestamp without time zone NOT NULL,
    used boolean DEFAULT false NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.email_codes OWNER TO postgres;

--
-- Name: exercise_tests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exercise_tests (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    exercise_id uuid NOT NULL,
    description character varying NOT NULL,
    input text,
    expected_output text NOT NULL,
    is_hidden boolean DEFAULT false NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.exercise_tests OWNER TO postgres;

--
-- Name: exercises; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exercises (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    type public.exercises_type_enum NOT NULL,
    difficulty public.exercises_difficulty_enum NOT NULL,
    xp_reward integer DEFAULT 10 NOT NULL,
    prompt text NOT NULL,
    data jsonb NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    lesson_id uuid NOT NULL
);


ALTER TABLE public.exercises OWNER TO postgres;

--
-- Name: lessons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lessons (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying NOT NULL,
    description text,
    "order" integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    module_id uuid NOT NULL
);


ALTER TABLE public.lessons OWNER TO postgres;

--
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: modules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.modules (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    module_number integer NOT NULL,
    name character varying NOT NULL,
    description text,
    icon character varying,
    "order" integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.modules OWNER TO postgres;

--
-- Name: reactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reactions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    challenge_id uuid NOT NULL,
    type character varying DEFAULT 'LIKE'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.reactions OWNER TO postgres;

--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_tokens (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "tokenHash" character varying NOT NULL,
    "expiresAt" timestamp without time zone NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" uuid
);


ALTER TABLE public.refresh_tokens OWNER TO postgres;

--
-- Name: user_badges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_badges (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    badge_id character varying NOT NULL,
    unlocked_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_badges OWNER TO postgres;

--
-- Name: user_challenge_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_challenge_progress (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    challenge_id uuid,
    completed_at timestamp without time zone DEFAULT now() NOT NULL,
    best_execution_time_ms numeric(10,3),
    attempts integer DEFAULT 1 NOT NULL,
    best_execution_code text
);


ALTER TABLE public.user_challenge_progress OWNER TO postgres;

--
-- Name: user_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_progress (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    exercise_id uuid NOT NULL,
    completed_at timestamp without time zone DEFAULT now() NOT NULL,
    attempts integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.user_progress OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying NOT NULL,
    email character varying NOT NULL,
    xp integer DEFAULT 0 NOT NULL,
    level integer DEFAULT 1 NOT NULL,
    is_public boolean DEFAULT true NOT NULL,
    bio character varying,
    github character varying,
    linkedin character varying,
    twitter character varying,
    website character varying,
    avatar_url character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    "authProvider" character varying,
    "providerId" character varying,
    avatar character varying,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: reactions PK_0b213d460d0c473bc2fb6ee27f3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reactions
    ADD CONSTRAINT "PK_0b213d460d0c473bc2fb6ee27f3" PRIMARY KEY (id);


--
-- Name: user_badges PK_0ca139216824d745a930065706a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT "PK_0ca139216824d745a930065706a" PRIMARY KEY (id);


--
-- Name: user_challenge_progress PK_1e0e12fc9b849b6a125348acd70; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_challenge_progress
    ADD CONSTRAINT "PK_1e0e12fc9b849b6a125348acd70" PRIMARY KEY (id);


--
-- Name: challenges PK_1e664e93171e20fe4d6125466af; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challenges
    ADD CONSTRAINT "PK_1e664e93171e20fe4d6125466af" PRIMARY KEY (id);


--
-- Name: challenge_tests PK_5131baa91c1ea81e92771fcdab9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challenge_tests
    ADD CONSTRAINT "PK_5131baa91c1ea81e92771fcdab9" PRIMARY KEY (id);


--
-- Name: email_codes PK_6ed15013da989317f69306da6e3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_codes
    ADD CONSTRAINT "PK_6ed15013da989317f69306da6e3" PRIMARY KEY (id);


--
-- Name: user_progress PK_7b5eb2436efb0051fdf05cbe839; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT "PK_7b5eb2436efb0051fdf05cbe839" PRIMARY KEY (id);


--
-- Name: refresh_tokens PK_7d8bee0204106019488c4c50ffa; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY (id);


--
-- Name: modules PK_7dbefd488bd96c5bf31f0ce0c95; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT "PK_7dbefd488bd96c5bf31f0ce0c95" PRIMARY KEY (id);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: lessons PK_9b9a8d455cac672d262d7275730; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT "PK_9b9a8d455cac672d262d7275730" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: exercises PK_c4c46f5fa89a58ba7c2d894e3c3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT "PK_c4c46f5fa89a58ba7c2d894e3c3" PRIMARY KEY (id);


--
-- Name: exercise_tests PK_exercise_tests; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercise_tests
    ADD CONSTRAINT "PK_exercise_tests" PRIMARY KEY (id);


--
-- Name: user_progress UQ_0dbc19d0e80ff069fd5ceea2d1a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT "UQ_0dbc19d0e80ff069fd5ceea2d1a" UNIQUE (user_id, exercise_id);


--
-- Name: user_challenge_progress UQ_1a638ffac29846274376b6d0ad6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_challenge_progress
    ADD CONSTRAINT "UQ_1a638ffac29846274376b6d0ad6" UNIQUE (user_id, challenge_id);


--
-- Name: user_badges UQ_201b6e34825dc5bd06181320bde; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT "UQ_201b6e34825dc5bd06181320bde" UNIQUE (user_id, badge_id);


--
-- Name: reactions UQ_46905d3d701eb4ec2c14cac81c9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reactions
    ADD CONSTRAINT "UQ_46905d3d701eb4ec2c14cac81c9" UNIQUE (user_id, challenge_id);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: modules UQ_c6adfbd51775148bee80d6e4190; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT "UQ_c6adfbd51775148bee80d6e4190" UNIQUE (module_number);


--
-- Name: users UQ_fe0bb3f6520ee0469504521e710; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE (username);


--
-- Name: exercises FK_26718d98059c38459d2c64ec824; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT "FK_26718d98059c38459d2c64ec824" FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- Name: lessons FK_35fb2307535d90a6ed290af1f4a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT "FK_35fb2307535d90a6ed290af1f4a" FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE;


--
-- Name: challenges FK_5afdb3ba1bc453064d77a1e885c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challenges
    ADD CONSTRAINT "FK_5afdb3ba1bc453064d77a1e885c" FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- Name: refresh_tokens FK_610102b60fea1455310ccd299de; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: challenge_tests FK_6608df60333af3faae08991e1cf; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challenge_tests
    ADD CONSTRAINT "FK_6608df60333af3faae08991e1cf" FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE CASCADE;


--
-- Name: user_challenge_progress FK_85a8e593e07f09680f5cf836d20; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_challenge_progress
    ADD CONSTRAINT "FK_85a8e593e07f09680f5cf836d20" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reactions FK_8b1cc425a952c6b172731d43275; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reactions
    ADD CONSTRAINT "FK_8b1cc425a952c6b172731d43275" FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE CASCADE;


--
-- Name: exercise_tests FK_aa8aaca58644771dfb8e1262f61; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercise_tests
    ADD CONSTRAINT "FK_aa8aaca58644771dfb8e1262f61" FOREIGN KEY (exercise_id) REFERENCES public.exercises(id) ON DELETE CASCADE;


--
-- Name: user_challenge_progress FK_c261d5c2360c03cf83a8459b8cb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_challenge_progress
    ADD CONSTRAINT "FK_c261d5c2360c03cf83a8459b8cb" FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE CASCADE;


--
-- Name: user_progress FK_c41601eeb8415a9eb15c8a4e557; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT "FK_c41601eeb8415a9eb15c8a4e557" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reactions FK_dde6062145a93649adc5af3946e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reactions
    ADD CONSTRAINT "FK_dde6062145a93649adc5af3946e" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_badges FK_f1221d9b1aaa64b1f3c98ed46d3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT "FK_f1221d9b1aaa64b1f3c98ed46d3" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict rwDxq68K91nrt8qKl8cIlnP5Y8aTbWnzz5g9Vowv7ajK9TAvsAsu43yjTVymnN7

