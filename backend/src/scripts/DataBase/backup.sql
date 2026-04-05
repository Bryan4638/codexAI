--
-- PostgreSQL database dump
--

\restrict AsCEanLtAVpFldVJPPXURr7fjFNCaKwUsgUx190QQlz0iplCnp38RKpzBfrkr4g

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
-- Name: daily_activity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.daily_activity (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    activity_date date NOT NULL,
    exercises_completed integer DEFAULT 0 NOT NULL,
    challenges_completed integer DEFAULT 0 NOT NULL,
    xp_earned integer DEFAULT 0 NOT NULL,
    time_spent_minutes integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.daily_activity OWNER TO postgres;

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
-- Name: live_coding_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.live_coding_sessions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    challenge_id uuid NOT NULL,
    code text,
    time_taken_seconds integer,
    execution_time_ms numeric(10,3),
    score integer DEFAULT 0 NOT NULL,
    tab_switches integer DEFAULT 0 NOT NULL,
    copy_paste_count integer DEFAULT 0 NOT NULL,
    penalties_applied integer DEFAULT 0 NOT NULL,
    all_tests_passed boolean DEFAULT false NOT NULL,
    started_at timestamp without time zone DEFAULT now() NOT NULL,
    completed_at timestamp without time zone
);


ALTER TABLE public.live_coding_sessions OWNER TO postgres;

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
-- Name: skill_node_dependencies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.skill_node_dependencies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    node_id uuid NOT NULL,
    depends_on_id uuid NOT NULL
);


ALTER TABLE public.skill_node_dependencies OWNER TO postgres;

--
-- Name: skill_nodes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.skill_nodes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug character varying(50) NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    icon character varying(10),
    category character varying(50) NOT NULL,
    module_id integer,
    required_exercises integer DEFAULT 0 NOT NULL,
    required_challenges integer DEFAULT 0 NOT NULL,
    position_x integer NOT NULL,
    position_y integer NOT NULL,
    xp_reward integer DEFAULT 50 NOT NULL
);


ALTER TABLE public.skill_nodes OWNER TO postgres;

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
-- Name: user_skill_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_skill_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    node_id uuid NOT NULL,
    status character varying(20) DEFAULT 'locked'::character varying NOT NULL,
    progress_percent integer DEFAULT 0 NOT NULL,
    unlocked_at timestamp without time zone,
    completed_at timestamp without time zone
);


ALTER TABLE public.user_skill_progress OWNER TO postgres;

--
-- Name: user_streaks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_streaks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    current_streak integer DEFAULT 0 NOT NULL,
    longest_streak integer DEFAULT 0 NOT NULL,
    last_activity_date date,
    streak_start_date date,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_streaks OWNER TO postgres;

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
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    league character varying(20) DEFAULT 'bronze'::character varying
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: weekly_xp; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.weekly_xp (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    xp_earned integer DEFAULT 0 NOT NULL,
    week_start date NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.weekly_xp OWNER TO postgres;

--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Data for Name: challenge_tests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.challenge_tests (id, description, input, expected_output, is_hidden, "order", challenge_id) FROM stdin;
983443de-2eaa-4a59-b982-62e023731072	Fib(20) (Oculto)	[20]	6765	f	7	2302c7ce-3368-41e0-ad8e-c85080ebc8c0
d44854e2-d731-4f45-b9ae-127dd824737a	Fib(25) (Oculto)	[25]	75025	f	8	2302c7ce-3368-41e0-ad8e-c85080ebc8c0
7aa5ec56-9e24-45d6-8d0b-d952aac245e0	Fib(30) (Oculto - Rendimiento Básico)	[30]	832040	f	8	2302c7ce-3368-41e0-ad8e-c85080ebc8c0
fcc832cc-612d-4db8-98c2-98abaf426c0c	Test rendimiento básico: string largo	["aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"]	true	f	10	de3bc42b-0c3a-4b0b-bdfd-7940b721c420
1ec65130-f492-4a9f-b705-1a30dc727c93	Test básico	[[2,7,11,15], 9]	[0,1]	f	1	c9610e02-948e-4abc-8476-8dea9d66c12a
49263a56-438e-42c5-9697-4d16259cdf60	Test intermedio	[[3,2,4], 6]	[1,2]	f	2	c9610e02-948e-4abc-8476-8dea9d66c12a
2a581989-9c02-4f4c-9e63-ab13ff50afc4	Test oculto con lista grande	[[1, 2, 3, 4, 5, 20, 25, 30], 45]	[3,7]	t	3	c9610e02-948e-4abc-8476-8dea9d66c12a
6371aec8-acff-473d-a755-2e29fcfa2a32	Test oculto con negativos	[[-1, -2, -3, -4, -5], -8]	[2,4]	t	4	c9610e02-948e-4abc-8476-8dea9d66c12a
eb93a894-8a09-4e20-8a30-f5c0c3382b5a	Test oculto extremo: mismos números en los bordes	[[5, 1, 2, 3, 4, 5], 10]	[0,5]	t	5	c9610e02-948e-4abc-8476-8dea9d66c12a
d10a3b53-e623-4926-8287-d96691fe529e	Test oculto extremo: elementos idénticos	[[3, 3], 6]	[0,1]	t	6	c9610e02-948e-4abc-8476-8dea9d66c12a
e537f95d-0f82-493c-9402-b9da21b55dca	Test oculto de ceros desplazados	[[0, 4, 3, 0], 0]	[0,3]	t	7	c9610e02-948e-4abc-8476-8dea9d66c12a
b4dd4f3c-bb9d-4572-aa32-01b4114dfa19	Test oculto: superación de límites	[[1000000000, 2000000000, 3000000000], 5000000000]	[1,2]	t	8	c9610e02-948e-4abc-8476-8dea9d66c12a
838acd3d-21ce-4c72-a011-c7196c52b48b	Test oculto: cancelación de negativo y positivo	[[-10, 7, 15, -5], 2]	[1,3]	t	9	c9610e02-948e-4abc-8476-8dea9d66c12a
c889e6c6-0cf3-4bdb-9b71-c74d4a15c276	Test oculto de desorden profundo	[[15, 3, 9, 8, 14, 2], 5]	[1,5]	t	10	c9610e02-948e-4abc-8476-8dea9d66c12a
e80687cc-3e7f-4cb5-bd12-679b054e637a	Test oculto: solución al puro final	[[10, 11, 12, 13, 14, 15], 29]	[4,5]	t	11	c9610e02-948e-4abc-8476-8dea9d66c12a
e180f71c-0b25-4f21-82fc-aeac1bd4b500	Test oculto de Rendimiento Estricto (Array Intermedio)	[[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20, 50, 100], 150]	[20,21]	t	12	c9610e02-948e-4abc-8476-8dea9d66c12a
186b5a65-9e01-4e50-866f-5fd0a6a47bda	Test rendimiento extremo: muy largo falso	["aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaac"]	false	t	11	de3bc42b-0c3a-4b0b-bdfd-7940b721c420
421d0338-e540-4e34-808f-187302c33159	Fib(35) (Oculto - Rendimiento Extremo)	[35]	9227465	t	9	2302c7ce-3368-41e0-ad8e-c85080ebc8c0
b1a98699-89ea-46eb-9312-6c753130d25d	Fib(40) (Oculto - Rendimiento Extremo)	[40]	102334155	t	10	2302c7ce-3368-41e0-ad8e-c85080ebc8c0
3b810605-b6a0-4c01-8d8c-525458d7de6d	Fib(45) (Oculto - Rendimiento Extremo)	[45]	1134903170	t	11	2302c7ce-3368-41e0-ad8e-c85080ebc8c0
ea5ba7ae-3fea-4914-a019-a717281a5770	Fib(50) (Oculto - Rendimiento Extremo)	[50]	12586269025	t	12	2302c7ce-3368-41e0-ad8e-c85080ebc8c0
\.


--
-- Data for Name: challenges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.challenges (id, title, description, initial_code, difficulty, created_at, author_id, test_cases) FROM stdin;
4fff9a3b-d665-485f-bca7-9602e6dbba72	FizzBuzz Clásico	Imprime los números del 1 al 100. Para múltiplos de 3 imprime 'Fizz', para múltiplos de 5 'Buzz', y para múltiplos de ambos 'FizzBuzz'.	function fizzBuzz() {\n  // Tu código aquí\n}	easy	2026-01-12 07:57:49.699	1ad14a3d-0f96-411e-a103-a0ec4dafe480	[]
82a49837-ef24-401f-89df-09a4e2ec1252	Palíndromo Detector	Crea una función que determine si una cadena es un palíndromo (se lee igual de izquierda a derecha que de derecha a izquierda).	function isPalindrome(str) {\n  // Tu código aquí\n}	easy	2025-11-23 07:57:49.703	5cb29817-5c04-48e7-9559-4cfb26318863	[]
1d6a9778-14e1-466f-8ef3-877dde7b5315	Suma de Arrays	Escribe una función que sume todos los números de un array sin usar el método reduce.	function sumArray(arr) {\n  // Tu código aquí\n}	easy	2026-01-04 07:57:49.706	238b9dac-2644-427e-8bd2-ed4c3abb8890	[]
cd66d563-720c-435c-b430-c3081763b89b	Fibonacci Secuencia	Genera los primeros N números de la secuencia de Fibonacci.	function fibonacci(n) {\n  // Tu código aquí\n}	medium	2025-10-31 08:57:49.709	939a0a06-1e1a-4cb8-a6b3-6737f38d264b	[]
28f8bd5a-8d37-4d05-b074-9d8574dec020	FizzBuzz Clásico	Imprime los números del 1 al 100. Para múltiplos de 3 imprime 'Fizz', para múltiplos de 5 'Buzz', y para múltiplos de ambos 'FizzBuzz'.	function fizzBuzz() {\n  // Tu código aquí\n}	easy	2025-11-27 08:00:25.821	50b2fd75-14de-406c-9db1-e61588b96068	[]
af219683-7e15-4fd7-a86d-5de6cb0ff7f8	Palíndromo Detector	Crea una función que determine si una cadena es un palíndromo (se lee igual de izquierda a derecha que de derecha a izquierda).	function isPalindrome(str) {\n  // Tu código aquí\n}	easy	2025-11-28 08:00:25.839	4338aa7b-9826-4c1f-8cf5-7d0a5331d4a2	[]
11d05ad1-7007-45f7-90d2-99f2374d6c6b	Suma de Arrays	Escribe una función que sume todos los números de un array sin usar el método reduce.	function sumArray(arr) {\n  // Tu código aquí\n}	easy	2025-12-27 08:00:25.843	27a7b508-cfef-4e86-a91c-1cbb6ef7d556	[]
81dcdb79-168e-48d2-9858-2db371184f88	Fibonacci Secuencia	Genera los primeros N números de la secuencia de Fibonacci.	function fibonacci(n) {\n  // Tu código aquí\n}	medium	2025-10-06 09:00:25.846	0587db93-4151-4825-8cbf-d96e5893212b	[]
638c6da7-f515-4b48-9969-b8ee5b3fbb3a	Factorial Recursivo	Implementa el cálculo del factorial de un número usando recursión.	function factorial(n) {\n  // Tu código aquí\n}	medium	2025-12-26 08:00:25.85	2f8e040e-fdce-4d63-908b-7d290e6c7ed1	[]
66d018e5-fee2-4248-beca-34b81d6dbac8	Ordenamiento Burbuja	Implementa el algoritmo de ordenamiento burbuja para ordenar un array de números.	function bubbleSort(arr) {\n  // Tu código aquí\n}	medium	2026-01-08 08:00:25.853	f9b29a1f-0ca4-4839-a144-388964c66555	[]
05f2c696-e127-46b6-b50e-e25fb9dcbbff	Búsqueda Binaria	Implementa una búsqueda binaria que retorne el índice del elemento buscado o -1 si no existe.	function binarySearch(arr, target) {\n  // Tu código aquí\n}	medium	2025-10-09 09:00:25.856	e7c55ea4-ee93-4b5a-8410-e27c6e65483b	[]
e48b7414-9510-4054-bfec-222e0eb1c0b5	Anagramas	Determina si dos cadenas son anagramas (contienen las mismas letras).	function areAnagrams(str1, str2) {\n  // Tu código aquí\n}	medium	2025-10-22 09:00:25.877	f9b29a1f-0ca4-4839-a144-388964c66555	[]
bcc9d481-9851-423c-9b59-5769c5a810a6	Números Primos	Encuentra todos los números primos hasta N usando la Criba de Eratóstenes.	function sieveOfEratosthenes(n) {\n  // Tu código aquí\n}	hard	2025-11-05 08:00:25.88	cdfff534-6c77-4db1-a2f2-faa601ad48eb	[]
e8d354a6-aab2-4c6d-a396-43b8017e1b01	Árbol Binario de Búsqueda	Implementa la inserción y búsqueda en un árbol binario de búsqueda.	class BST {\n  constructor() {\n    this.root = null;\n  }\n  \n  insert(value) {\n    // Tu código aquí\n  }\n  \n  search(value) {\n    // Tu código aquí\n  }\n}	hard	2025-12-24 08:00:25.882	dcbd21e4-2164-4f08-b560-e3e06c906b12	[]
86df4c41-ff51-4c19-8820-f409dda1079e	Merge Sort	Implementa el algoritmo de ordenamiento Merge Sort.	function mergeSort(arr) {\n  // Tu código aquí\n}	hard	2025-11-07 08:00:25.886	deaa1ab2-4d52-4cb4-a36b-fcc583b99992	[]
3f26d7a3-4ad4-4eb1-bf85-ee1c7b95342f	Quick Sort	Implementa el algoritmo de ordenamiento Quick Sort.	function quickSort(arr) {\n  // Tu código aquí\n}	hard	2026-01-20 08:00:25.888	90166457-241e-46a6-bd4b-1a19d8bfe12a	[]
9e0808e0-a7ef-4d37-b4b2-832b5e9e90f9	Validar Paréntesis	Verifica si una cadena tiene paréntesis, corchetes y llaves balanceados.	function isBalanced(str) {\n  // Tu código aquí\n}	medium	2026-01-08 08:00:25.892	d0deb68d-283f-465f-9c10-211a4742a34e	[]
3e133d99-e440-421d-b578-bf39e27451c2	Invertir Palabras	Invierte el orden de las palabras en una oración.	function reverseWords(str) {\n  // Tu código aquí\n}	easy	2026-01-17 08:00:25.895	5cb29817-5c04-48e7-9559-4cfb26318863	[]
e3b10f93-e71a-4de6-b027-5f5d6b167108	Contador de Vocales	Cuenta el número de vocales en una cadena.	function countVowels(str) {\n  // Tu código aquí\n}	easy	2025-11-08 08:00:25.9	f7b55a67-e41f-4c48-902c-0ea858cd13be	[]
9755fc69-af21-4cac-9b3d-a15e33c52e57	Suma de Dos Números	Encuentra dos números en un array que sumen un objetivo dado. Retorna sus índices.	function twoSum(nums, target) {\n  // Tu código aquí\n}	medium	2025-10-10 09:00:25.903	33d891e5-c4e9-4caa-bd27-f66e6cfb37a3	[]
3d78ec6b-cef7-4694-9ca1-14817fcbfbd5	Cadena Más Larga Sin Repetir	Encuentra la longitud de la subcadena más larga sin caracteres repetidos.	function lengthOfLongestSubstring(s) {\n  // Tu código aquí\n}	hard	2025-10-09 09:00:25.907	b2e33f04-354c-4b61-9db1-72d4cb2bf07c	[]
dad7963e-e7ca-456f-82b4-3755125cece4	Rotar Array	Rota un array k posiciones a la derecha.	function rotate(nums, k) {\n  // Tu código aquí\n}	medium	2026-01-04 08:00:25.909	71acdd69-48cd-4740-80d8-962b70085449	[]
d8df278b-4c38-4450-b244-87f07062175f	Máximo Subarray	Encuentra el subarray contiguo con la suma máxima (Algoritmo de Kadane).	function maxSubArray(nums) {\n  // Tu código aquí\n}	hard	2025-10-08 09:00:25.912	33d891e5-c4e9-4caa-bd27-f66e6cfb37a3	[]
2baf99b2-9b1e-4e88-b38d-8bffb6560354	Escaleras	Puedes subir 1 o 2 escalones a la vez. ¿De cuántas formas distintas puedes subir N escalones?	function climbStairs(n) {\n  // Tu código aquí\n}	easy	2025-10-22 09:00:25.914	07c79298-6724-4826-934c-0c0693e8f51a	[]
1d23ae27-a731-4e3c-84cb-100c355cf77d	FizzBuzz Clásico	Imprime los números del 1 al 100. Para múltiplos de 3 imprime 'Fizz', para múltiplos de 5 'Buzz', y para múltiplos de ambos 'FizzBuzz'.	function fizzBuzz() {\n  // Tu código aquí\n}	easy	2026-01-08 08:15:19.59	7bbf08be-8791-4b49-9452-3200a0b22b87	[]
1dde3a6b-cd87-4f0f-9a0f-15b8ac3acd75	Palíndromo Detector	Crea una función que determine si una cadena es un palíndromo (se lee igual de izquierda a derecha que de derecha a izquierda).	function isPalindrome(str) {\n  // Tu código aquí\n}	easy	2025-10-05 09:15:19.613	62c61c87-6e44-4d1e-b891-5a637c989a03	[]
8335563a-9cd0-43c4-93b6-3e55b1350f3c	Suma de Arrays	Escribe una función que sume todos los números de un array sin usar el método reduce.	function sumArray(arr) {\n  // Tu código aquí\n}	easy	2025-11-26 08:15:19.618	f3642b14-2e93-44f2-84fc-db0ed83b404f	[]
dc82f92a-bf51-4b9f-9402-668ab7c06af1	Fibonacci Secuencia	Genera los primeros N números de la secuencia de Fibonacci.	function fibonacci(n) {\n  // Tu código aquí\n}	medium	2026-01-30 08:15:19.621	4122c870-8a2d-4191-a4aa-fbf19fdaac1a	[]
d41389e0-7f3c-4bbd-82f8-cb4086ed2004	Factorial Recursivo	Implementa el cálculo del factorial de un número usando recursión.	function factorial(n) {\n  // Tu código aquí\n}	medium	2025-11-20 08:15:19.625	444cd236-b686-4c61-87c9-2a9e87933d7b	[]
183e97e4-143e-4ee2-b3f5-7882d4ff1ad7	Ordenamiento Burbuja	Implementa el algoritmo de ordenamiento burbuja para ordenar un array de números.	function bubbleSort(arr) {\n  // Tu código aquí\n}	medium	2025-11-04 08:15:19.628	5b8d59f9-35b5-4ec3-aca1-1573faf85f67	[]
ea755ed4-abdb-44bd-8c96-93eaaf45caf0	Búsqueda Binaria	Implementa una búsqueda binaria que retorne el índice del elemento buscado o -1 si no existe.	function binarySearch(arr, target) {\n  // Tu código aquí\n}	medium	2025-11-12 08:15:19.631	dcbd21e4-2164-4f08-b560-e3e06c906b12	[]
bcf65b61-4e01-419e-a291-cd5837eedddf	Anagramas	Determina si dos cadenas son anagramas (contienen las mismas letras).	function areAnagrams(str1, str2) {\n  // Tu código aquí\n}	medium	2025-11-30 08:15:19.634	444cd236-b686-4c61-87c9-2a9e87933d7b	[]
3028ad20-a8ae-4916-bf2d-887d78518405	Números Primos	Encuentra todos los números primos hasta N usando la Criba de Eratóstenes.	function sieveOfEratosthenes(n) {\n  // Tu código aquí\n}	hard	2025-11-05 08:15:19.637	62c61c87-6e44-4d1e-b891-5a637c989a03	[]
719957a1-5940-496d-bb28-140d231843ec	Árbol Binario de Búsqueda	Implementa la inserción y búsqueda en un árbol binario de búsqueda.	class BST {\n  constructor() {\n    this.root = null;\n  }\n  \n  insert(value) {\n    // Tu código aquí\n  }\n  \n  search(value) {\n    // Tu código aquí\n  }\n}	hard	2025-10-14 09:15:19.641	d0deb68d-283f-465f-9c10-211a4742a34e	[]
643f6b82-ef57-41fe-8049-8588069c0b83	Merge Sort	Implementa el algoritmo de ordenamiento Merge Sort.	function mergeSort(arr) {\n  // Tu código aquí\n}	hard	2026-01-26 08:15:19.643	66e331b4-7b4b-42a6-b0be-532332292f1b	[]
1ba6deb2-7dca-488c-a6ca-33e0bc33d354	Quick Sort	Implementa el algoritmo de ordenamiento Quick Sort.	function quickSort(arr) {\n  // Tu código aquí\n}	hard	2025-11-14 08:15:19.646	dcbd21e4-2164-4f08-b560-e3e06c906b12	[]
6ea31b6f-ac71-4780-9576-9abbcb403542	Validar Paréntesis	Verifica si una cadena tiene paréntesis, corchetes y llaves balanceados.	function isBalanced(str) {\n  // Tu código aquí\n}	medium	2025-11-09 08:15:19.648	7bbf08be-8791-4b49-9452-3200a0b22b87	[]
90254005-32ef-4413-a61d-3becac6543a7	Invertir Palabras	Invierte el orden de las palabras en una oración.	function reverseWords(str) {\n  // Tu código aquí\n}	easy	2025-12-15 08:15:19.651	99c9a347-c807-45d1-ae17-1b98989b11d5	[]
da4b6c7f-bb64-4b5e-90f3-dac610ac6ba5	Contador de Vocales	Cuenta el número de vocales en una cadena.	function countVowels(str) {\n  // Tu código aquí\n}	easy	2026-01-16 08:15:19.653	0587db93-4151-4825-8cbf-d96e5893212b	[]
3d101b84-ccd2-4315-8b10-d557642de808	Suma de Dos Números	Encuentra dos números en un array que sumen un objetivo dado. Retorna sus índices.	function twoSum(nums, target) {\n  // Tu código aquí\n}	medium	2026-01-27 08:15:19.655	33d891e5-c4e9-4caa-bd27-f66e6cfb37a3	[]
ce028d91-13de-4100-b187-6b9b3a87e9a9	Cadena Más Larga Sin Repetir	Encuentra la longitud de la subcadena más larga sin caracteres repetidos.	function lengthOfLongestSubstring(s) {\n  // Tu código aquí\n}	hard	2026-01-20 08:15:19.657	6612a331-2296-4356-9611-a2c836fadf7e	[]
82009565-7b4c-460f-b3d4-e3c6641d3a3d	Rotar Array	Rota un array k posiciones a la derecha.	function rotate(nums, k) {\n  // Tu código aquí\n}	medium	2025-10-25 09:15:19.659	91fb42f5-a87c-4ec0-97bd-2ca1fc3eff88	[]
a3584a76-73bd-435b-9d44-663ce753b456	Máximo Subarray	Encuentra el subarray contiguo con la suma máxima (Algoritmo de Kadane).	function maxSubArray(nums) {\n  // Tu código aquí\n}	hard	2025-11-15 08:15:19.661	71acdd69-48cd-4740-80d8-962b70085449	[]
2881ab0e-6ec3-46f5-9627-46024b754a99	Escaleras	Puedes subir 1 o 2 escalones a la vez. ¿De cuántas formas distintas puedes subir N escalones?	function climbStairs(n) {\n  // Tu código aquí\n}	easy	2025-10-29 09:15:19.663	f72c60c1-cba6-4b45-b182-49b3b4a3e651	[]
c9610e02-948e-4abc-8476-8dea9d66c12a	Dos Sumas (Two Sum)	Dado un arreglo de números enteros `nums` y un número entero `target`, devuelve los *índices de los dos números de manera que sumen* `target`.\n    \nPuedes asumir que cada entrada tendría **exactamente una solución**, y no puedes usar el mismo elemento dos veces.\nAceptaremos la respuesta en cualquier orden. Tu función debe imprimir un arreglo JSON o los números separados por coma.\n**Ejemplo:**\nInput: nums = [2,7,11,15], target = 9\nOutput: [0, 1]	// Escribe tu función aquí para sumar dos números y usa `console.log` para imprimir el resultado\nfunction twoSum(nums, target) {\n  // tu código\n}\n\n// Ejemplo de llamada: console.log(twoSum([2, 7, 11, 15], 9));\n	Fácil	2026-02-28 17:51:01.033811	30378a2f-9ad0-4849-82ff-4c162480ee11	[]
de3bc42b-0c3a-4b0b-bdfd-7940b721c420	Validar Palíndromo	Dada una cadena de texto `s`, retorna `true` si es un palíndromo, o `false` en caso contrario.\n\nUna frase es un palíndromo si, después de convertir todas las letras mayúsculas a letras minúsculas y eliminar todos los caracteres no alfanuméricos, se lee igual hacia adelante que hacia atrás. Los caracteres alfanuméricos incluyen letras y números.\n\n**Ejemplo:**\nInput: s = "A man, a plan, a canal: Panama"\nOutput: true	function isPalindrome(s) {\n  // Escribe tu código aquí\n}\n\n// console.log(isPalindrome("racecar"));	Fácil	2026-02-28 17:51:01.060863	30378a2f-9ad0-4849-82ff-4c162480ee11	[]
2302c7ce-3368-41e0-ad8e-c85080ebc8c0	Sucesión de Fibonacci	El número de Fibonacci, comúnmente denotado como `F(n)` forma una secuencia, llamada la *sucesión de Fibonacci*, tal que cada número es la suma de los dos anteriores, comenzando en 0 y 1.\n\nDicho `n`, calcula `F(n)`. Imprime el resultado numérico en consola.\n\n**Ejemplo:**\nInput: n = 4\nOutput: 3\nExplicación: F(4) = F(3) + F(2) = 2 + 1 = 3.	function fib(n) {\n  // Implementa aquí\n}\n\n// Ejemplo: console.log(fib(4))	Fácil	2026-02-28 17:51:01.078181	30378a2f-9ad0-4849-82ff-4c162480ee11	[]
\.


--
-- Data for Name: daily_activity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.daily_activity (id, user_id, activity_date, exercises_completed, challenges_completed, xp_earned, time_spent_minutes, created_at) FROM stdin;
255cee11-4e08-4e8f-94eb-1b6da4244082	5086d4a7-519a-4496-9938-ee343f38861f	2026-03-19	3	2	189	2	2026-03-19 13:38:37.574059
ba8546cc-2736-4a44-8171-ebfaca3fb0d7	5086d4a7-519a-4496-9938-ee343f38861f	2026-03-18	7	1	812	4	2026-03-19 10:06:06.984195
f89132a2-478c-4f77-a7ac-5750a039c508	5086d4a7-519a-4496-9938-ee343f38861f	2026-03-11	1	2	123	1	2026-03-19 10:09:34.900576
9f7bf1d3-a714-40e7-85e9-4315f145f2cc	5086d4a7-519a-4496-9938-ee343f38861f	2026-03-20	4	0	40	0	2026-03-20 15:03:41.97448
\.


--
-- Data for Name: email_codes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.email_codes (id, email, "codeHash", "expiresAt", used, "createdAt") FROM stdin;
06a3ca10-07ab-45f7-bd2a-b85fb14234de	brayancespedes57@gmail.com	$2b$10$lI2KctsJH83cFby27EE1g.9r/Dado7llhuxsYhRXGRdD/e7GmsMtu	2026-02-16 01:00:11.094	f	2026-02-16 05:55:11.098318
4d8a79d5-bf69-408d-891f-3d3be087d38b	brayancespedes57@gmail.com	$2b$10$PzbhFrrqngGOcrIyHKl8O.lSoRmOJwtZCOqdxUAES3s7N9ZpZtHSm	2026-02-16 01:06:48.803	f	2026-02-16 06:01:48.805599
c12bb978-4205-401e-9ec0-f3007d786c63	brayancespedes57@gmail.com	$2b$10$4uBqi2RoKScFkbXkLAM9Vu.eWem3jQEvapkSvjv8lv24sOxQwbOuq	2026-02-16 01:08:38.134	t	2026-02-16 06:03:38.144826
78b77da7-2b2b-4ee6-b4f6-2606d408a34f	brayancespedes57@gmail.com	$2b$10$OxsrcEJBKR6M7mNifE3GbulfNGd9nYeBYiJdOEt0/FXnbAVQfS4dq	2026-02-16 01:18:55.944	f	2026-02-16 06:13:55.952895
2367c38e-6a04-491d-b6c3-65e20e35c0eb	brayancespedes57@gmail.com	$2b$10$CI70hW9jL4m1nJTUJsF8e.gKdfKGocXhFYMmA2ex/YPN86wmmhDTG	2026-02-16 01:26:07.578	t	2026-02-16 06:21:07.581024
623827bf-3534-4bc1-95e4-f19af2b62f5e	brayancespedes57@gmail.com	$2b$10$k7KDmj/rqnMnhHzAgmEc1.b6Byp6jyjajJ1WYuUV6PhYKeqesw09e	2026-02-16 01:27:48.037	f	2026-02-16 06:22:48.048926
3ac74fe2-77b7-4f07-b11f-f41dcae89e24	brayancespedes57@gmail.com	$2b$10$2EBq/2hishEk5VFRSU94fO/Gvs4H6zojHaPFoKNR2GDDKgfws.grC	2026-02-16 01:29:29.449	f	2026-02-16 06:24:29.453233
2a012a0b-3c0f-4059-8ce8-144d5506a1de	brayancespedes57@gmail.com	$2b$10$Ofui4u7Nx4r8WiiH0sTD5unu8GCXSkmytw92/Hq49itVLqcQcX3Ou	2026-02-16 01:30:23.696	t	2026-02-16 06:25:23.697437
d723b88b-e805-469e-b006-38c368ac4bb1	brayancespedes57@gmail.com	$2b$10$7lcKjzAEPvRJEocujJW/MuCcjkb5riim1t/suYNabX7SJV6J0vwqa	2026-02-19 18:36:56.172	t	2026-02-19 23:31:56.18657
227761c7-9977-4a8c-9782-4c5651b33801	brayancespedes57@gmail.com	$2b$10$SO8rH04T6hgZ3TtcM6nvBu37KX5uW4VQVAHg0gtvh3b7N84U6T5pS	2026-02-23 12:06:51.852	t	2026-02-23 17:01:51.862794
d5889595-7038-42eb-8b25-a8b27bb47a57	brayancespedes57@gmail.com	$2b$10$IMCEQpGtdlXiKXq8wNeEU.1fwer8irjN0R0JLOhURpZ/1FH47I78O	2026-02-27 10:31:16.941	t	2026-02-27 15:26:16.951848
27c282cc-b4ac-4e9d-a483-53ced834ae21	brayancespedes57@gmail.com	$2b$10$.S37yt8wwYxLonMJcdT5ou0LQSwLOc.h01DG3ddTXxZGW.UCd8wGi	2026-02-27 10:51:12.465	f	2026-02-27 15:46:12.468911
a8b7d9b8-70ab-412f-8a78-2efa4b0bc3c4	brayancespedes57@gmail.com	$2b$10$sN/BmbBWtcm3G.xe.eEOouYIh91/BWpN8HWWGPkjctdpx4Ung.UY6	2026-02-27 10:51:52.984	f	2026-02-27 15:46:53.000896
227e48c0-4b49-40df-8a06-bddcc7efd23a	brayancespedes57@gmail.com	$2b$10$Sm7Kg9nV12RnixIUEiHdI.mr15q5Myvy3Pm8PfWj6LkHOzsVffrbK	2026-02-27 10:53:04.297	f	2026-02-27 15:48:04.301198
61bbb61f-e773-4690-951d-3c9bce2dbd4e	brayancespedes57@gmail.com	$2b$10$XSmhCL/plshLaYmO.vPyluL3/CfIaQDezomd0hAbJqnMlHFCazk8a	2026-02-27 10:56:27.045	f	2026-02-27 15:51:27.047041
ff65635d-7624-482b-9160-4c7c2d6da17d	brayancespedes57@gmail.com	$2b$10$8L6RIJSq47Pds5gwARgP8OB71YGLGaekl4t2Z.4xMZgEFlm1NOZ/m	2026-02-27 10:59:24.401	t	2026-02-27 15:54:24.410021
480b872c-a022-445c-ad1d-129ddceaf3aa	brayancespedes57@gmail.com	$2b$10$AshOtap6AQqPWuHkQz31FeRUpPAvn32EDslpC2.9Vd2nY8nUr20Ba	2026-03-01 19:11:53.354	f	2026-03-02 00:06:53.366097
0e780390-3725-40bc-80d2-9de5af8e193e	brayancespedes57@gmail.com	$2b$10$8AB/KP3JJsPuG/3PbBvGpOjsGHOwGpHsTfGhrc/GZrVG08Thklh.m	2026-03-11 13:15:51.958	f	2026-03-11 17:10:51.969265
53e42823-4165-456a-b67a-4bcc4b69c610	brayancespedes57@gmail.com	$2b$10$vPg9glrp4RbE3Z5aXjMWPOtAEqeEnW8IoD5kekZOp./WJvq3WfU3y	2026-03-11 13:21:06.517	f	2026-03-11 17:16:06.524189
b65aa128-d6dc-43af-b619-fb58d7fa452b	brayancespedes57@gmail.com	$2b$10$sTIWbGZhLKM/OI42BD4Q7e5BvWNzXQyKbOAXUdwNQ.6rpsQlc43/O	2026-03-11 13:25:09.149	f	2026-03-11 17:20:09.155057
af0ddf2b-1b0a-466e-8b8b-f2ec2d114f46	brayancespedes57@gmail.com	$2b$10$hafp523dQvlYQ6aLH552K.WBOgTPHcJjZtSDrojbj8cfJMR52A7EC	2026-03-14 08:07:21.848	f	2026-03-14 12:02:21.862501
953954aa-a0d6-4851-affe-39b6e11dfbbe	brayancespedes57@gmail.com	$2b$10$URwGIDUqCLDHrALcuEZevO9VeHNJhtXtuo.mYc/ZYwatJ74AWOO2a	2026-03-14 08:08:45.707	t	2026-03-14 12:03:45.720924
a30aa9a8-524f-4d47-93d0-ed6a6422dc11	gsdfdsfdsf@gmail.com	$2b$10$yP0ilraChaO.9HWmM0iohu3UzQegQY8QTHqC7ZGIF/XGAPs86.4xy	2026-03-14 08:11:21.844	t	2026-03-14 12:06:21.852485
74ba853a-1289-4c01-bb89-10abb9b235fa	brayancespedes57@gmail.com	$2b$10$GkQfA74h5R.ctxrix/F89OGpmpUj6.0Z6sWVQ4XGz6MmsWULVN4Pa	2026-03-14 08:21:54.63	t	2026-03-14 12:16:54.640357
6b55410c-a153-440e-aad5-ccc5b1ef115e	brayancespedes57@gmail.com	$2b$10$MwS0/tw57XdpKtJQ1IGQ8uxcFFvCinERq8WdRP4RL5.7EYrVq20Ke	2026-03-16 10:19:00.677	t	2026-03-16 14:14:00.688364
\.


--
-- Data for Name: exercise_tests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exercise_tests (id, exercise_id, description, input, expected_output, is_hidden, "order", created_at, updated_at) FROM stdin;
86c9fb38-4a97-453d-899e-abf6d71e4827	aad45c13-3f0c-414d-b4f6-fbc5ca997eaa	suma(1, 2) debe retornar 3	[1, 2]	3	f	1	2026-02-27 16:30:21.614044	2026-02-27 16:30:21.614044
fbe2e6a7-0e69-45ba-b461-b465c8ff51ad	aad45c13-3f0c-414d-b4f6-fbc5ca997eaa	suma(0, 0) debe retornar 0	[0, 0]	0	f	2	2026-02-27 16:30:21.626199	2026-02-27 16:30:21.626199
239daaf8-a902-410f-a05c-4619fdce5776	aad45c13-3f0c-414d-b4f6-fbc5ca997eaa	suma(-5, 5) debe retornar 0	[-5, 5]	0	t	3	2026-02-27 16:30:21.636452	2026-02-27 16:30:21.636452
55083f18-e88e-42d7-a838-3995df943600	aad45c13-3f0c-414d-b4f6-fbc5ca997eaa	suma(1000, 999) debe retornar 1999	[1000, 999]	1999	t	4	2026-02-27 16:30:21.646669	2026-02-27 16:30:21.646669
c1d92f0d-ce63-4058-829e-ccc7ce872c31	8bd83ac8-18e9-4214-8304-8b167e77699c	esPrimo(2) debe retornar true	[2]	true	f	1	2026-02-27 16:30:21.666174	2026-02-27 16:30:21.666174
33e4977d-029c-4e8b-84e0-a1728e6625b5	8bd83ac8-18e9-4214-8304-8b167e77699c	esPrimo(4) debe retornar false	[4]	false	f	2	2026-02-27 16:30:21.679496	2026-02-27 16:30:21.679496
401f5a2b-40f6-4504-990a-f03964711795	8bd83ac8-18e9-4214-8304-8b167e77699c	esPrimo(1) debe retornar false	[1]	false	t	3	2026-02-27 16:30:21.691429	2026-02-27 16:30:21.691429
80b61130-5301-41a3-805a-09ba3d4fca55	8bd83ac8-18e9-4214-8304-8b167e77699c	esPrimo(97) debe retornar true	[97]	true	t	4	2026-02-27 16:30:21.702028	2026-02-27 16:30:21.702028
4743e9d5-572f-46d6-9bcc-a07fd11f8a9f	0ca10781-9822-43f1-9a25-e021c87e3aae	invertirString("hola") debe retornar "aloh"	["hola"]	aloh	f	1	2026-02-27 16:30:21.721229	2026-02-27 16:30:21.721229
72db8812-b04e-4b70-91b5-40901914c565	0ca10781-9822-43f1-9a25-e021c87e3aae	invertirString("abc") debe retornar "cba"	["abc"]	cba	f	2	2026-02-27 16:30:21.730359	2026-02-27 16:30:21.730359
96fb4062-ad8a-4f2f-8394-0bbc0ba9c295	0ca10781-9822-43f1-9a25-e021c87e3aae	invertirString("") debe retornar ""	[""]		t	3	2026-02-27 16:30:21.740345	2026-02-27 16:30:21.740345
eac0b635-dd2a-48d4-aaf6-936e72f35d75	0ca10781-9822-43f1-9a25-e021c87e3aae	invertirString("a") debe retornar "a"	["a"]	a	t	4	2026-02-27 16:30:21.749168	2026-02-27 16:30:21.749168
ce76486b-9c58-4d99-8408-236330fce54f	4f883cb2-377a-4896-b7a6-8faef7e96c6b	fibonacci(1) debe retornar 1	[1]	1	f	1	2026-02-27 16:30:21.76987	2026-02-27 16:30:21.76987
3f49a7cb-a31b-498b-b063-957484078fd0	4f883cb2-377a-4896-b7a6-8faef7e96c6b	fibonacci(5) debe retornar 5	[5]	5	f	2	2026-02-27 16:30:21.780394	2026-02-27 16:30:21.780394
5dc044db-fd59-414f-bb97-fbe1dfcaa354	4f883cb2-377a-4896-b7a6-8faef7e96c6b	fibonacci(0) debe retornar 0	[0]	0	t	3	2026-02-27 16:30:21.790387	2026-02-27 16:30:21.790387
617b5c51-526d-48ec-9980-df0976aacb08	4f883cb2-377a-4896-b7a6-8faef7e96c6b	fibonacci(10) debe retornar 55	[30]	832040	t	4	2026-02-27 16:30:21.799555	2026-02-27 16:30:21.799555
\.


--
-- Data for Name: exercises; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exercises (id, type, difficulty, xp_reward, prompt, data, "order", is_active, created_at, updated_at, lesson_id) FROM stdin;
2eab7f99-8268-4166-b81d-67bc693623bd	code	beginner	10	Declara una variable llamada "mensaje" con el valor "Hola Mundo"	{"hint": "Usa let o const seguido del nombre y el valor entre comillas", "solutions": ["let mensaje = \\"Hola Mundo\\"", "let mensaje = 'Hola Mundo'", "const mensaje = \\"Hola Mundo\\"", "const mensaje = 'Hola Mundo'"], "explanation": "Las variables string siempre deben ir entre comillas simples o dobles.", "placeholder": "// Escribe tu código aquí\\n"}	0	t	2026-02-05 18:33:58.105877	2026-02-05 18:33:58.105877	09e913f9-5646-47c7-a721-172fb3d0a57e
b6d5863a-b427-4baa-9516-44b2166001e9	quiz	beginner	10	¿Cuál es la forma correcta de declarar una constante?	{"options": [{"id": "a", "text": "var PI = 3.14"}, {"id": "b", "text": "let PI = 3.14"}, {"id": "c", "text": "const PI = 3.14"}, {"id": "d", "text": "constant PI = 3.14"}], "explanation": "const se usa para declarar valores que no cambiarán", "correctAnswer": "c"}	0	t	2026-02-05 18:33:58.110013	2026-02-05 18:33:58.110013	09e913f9-5646-47c7-a721-172fb3d0a57e
1fdc5c6a-6c28-4d84-a100-be6b6bb4e94b	code	intermediate	15	Declara una variable "edad" con valor 25 y otra "nombre" con tu nombre	{"hint": "Declara cada variable en una línea separada", "solutions": ["let edad = 25", "const edad = 25"], "explanation": "Puedes declarar múltiples variables en líneas separadas para mayor claridad.", "placeholder": "// Declara las dos variables\\n"}	0	t	2026-02-05 18:33:58.113929	2026-02-05 18:33:58.113929	09e913f9-5646-47c7-a721-172fb3d0a57e
5414c287-b691-4485-a701-c072a74d0886	quiz	beginner	10	¿Qué tipo de dato es el valor false?	{"options": [{"id": "a", "text": "String"}, {"id": "b", "text": "Number"}, {"id": "c", "text": "Boolean"}, {"id": "d", "text": "Undefined"}], "explanation": "false es un valor booleano, al igual que true", "correctAnswer": "c"}	0	t	2026-02-05 18:33:58.117471	2026-02-05 18:33:58.117471	f7bc894a-4e9b-40bf-bcb1-e4e92acea017
578009d0-29ca-4263-9595-7ee7bf19fa4e	fillBlank	beginner	10	Completa el código para declarar un número:	{"hint": "Asigna cualquier valor numérico.", "blanks": [{"id": 0, "answers": ["regex:^\\\\d+$"]}], "template": ["let precio = ", ";"], "explanation": "Los números en JavaScript no llevan comillas."}	0	t	2026-02-05 18:33:58.120775	2026-02-05 18:33:58.120775	f7bc894a-4e9b-40bf-bcb1-e4e92acea017
d2d8955b-5621-487b-b2ff-8f458fd2be8e	quiz	intermediate	15	¿Qué devuelve typeof "42"?	{"options": [{"id": "a", "text": "number"}, {"id": "b", "text": "string"}, {"id": "c", "text": "boolean"}, {"id": "d", "text": "object"}], "explanation": "\\"42\\" está entre comillas, por lo que es un string", "correctAnswer": "b"}	0	t	2026-02-05 18:33:58.125282	2026-02-05 18:33:58.125282	f7bc894a-4e9b-40bf-bcb1-e4e92acea017
1fbe6b58-3e49-44a9-8c92-001b613c0be4	code	advanced	25	Crea un objeto "persona" con propiedades nombre, edad y activo	{"hint": "Usa llaves {} para crear objetos", "solutions": ["let persona = { nombre:", "const persona = { nombre:", "persona = {nombre:"], "explanation": "Los objetos agrupan propiedades relacionadas entre llaves {}.", "placeholder": "// Crea el objeto persona\\n"}	0	t	2026-02-05 18:33:58.128827	2026-02-05 18:33:58.128827	f7bc894a-4e9b-40bf-bcb1-e4e92acea017
1bbc93c9-ae8a-4c48-b536-669b561295a8	dragDrop	beginner	10	Ordena el código para crear un condicional correcto:	{"hint": "La estructura es: if (condición) { bloque } else { bloque }", "items": [{"id": 1, "text": "if (temperatura > 30) {"}, {"id": 2, "text": "  console.log(\\"Hace calor\\");"}, {"id": 3, "text": "} else {"}, {"id": 4, "text": "  console.log(\\"Clima agradable\\");"}, {"id": 5, "text": "}"}], "explanation": "El bloque 'else' se ejecuta cuando la condición del 'if' es falsa.", "correctOrder": [1, 2, 3, 4, 5]}	0	t	2026-02-05 18:33:58.132738	2026-02-05 18:33:58.132738	016fdff1-5599-4749-a582-5e945ac6bc4f
ccbb2ae9-7308-437f-bfdf-ffdd1a87f71c	code	beginner	10	Escribe un if que muestre "Aprobado" si la variable nota es mayor o igual a 60	{"hint": "Usa if con la condición nota >= 60", "solutions": ["if (nota >= 60)", "if(nota >= 60)", "if (nota>=60)"], "explanation": "Las comparaciones >= verifican si es mayor o igual.", "placeholder": "let nota = 75;\\n\\n// Escribe tu código aquí\\n"}	0	t	2026-02-05 18:33:58.136128	2026-02-05 18:33:58.136128	016fdff1-5599-4749-a582-5e945ac6bc4f
b984fbb5-163a-4f1c-adc1-7401babd3d4b	code	intermediate	15	Escribe un if-else que muestre "Mayor de edad" si edad >= 18, sino "Menor de edad"	{"hint": "Necesitas tanto if como else", "solutions": ["regex:if\\\\s*\\\\(\\\\s*edad\\\\s*>=\\\\s*18\\\\s*\\\\)[\\\\s\\\\S]*else"], "explanation": "El bloque else captura todos los casos no cubiertos por el if.", "placeholder": "let edad = 20;\\n\\n// Escribe tu código aquí\\n"}	0	t	2026-02-05 18:33:58.139277	2026-02-05 18:33:58.139277	016fdff1-5599-4749-a582-5e945ac6bc4f
99d6b5ac-4d43-437d-ad4d-2636ebbae647	code	advanced	25	Escribe un if-else if-else para clasificar notas: >= 90 "Excelente", >= 70 "Aprobado", sino "Reprobado"	{"hint": "Usa else if para condiciones intermedias", "solutions": ["regex:if\\\\s*\\\\(\\\\s*nota\\\\s*>=\\\\s*90\\\\s*\\\\)[\\\\s\\\\S]*else\\\\s+if\\\\s*\\\\(\\\\s*nota\\\\s*>=\\\\s*70\\\\s*\\\\)[\\\\s\\\\S]*else"], "explanation": "else if permite encadenar múltiples condiciones secuenciales.", "placeholder": "let nota = 85;\\n\\n// Escribe tu código aquí\\n"}	0	t	2026-02-05 18:33:58.142928	2026-02-05 18:33:58.142928	016fdff1-5599-4749-a582-5e945ac6bc4f
3a9e5c9d-0c92-424d-80ab-9fbfa55099de	quiz	beginner	10	¿Cuál es el resultado de: 10 === "10"?	{"options": [{"id": "a", "text": "true"}, {"id": "b", "text": "false"}, {"id": "c", "text": "undefined"}, {"id": "d", "text": "Error"}], "explanation": "=== compara valor Y tipo. 10 es number, \\"10\\" es string", "correctAnswer": "b"}	0	t	2026-02-05 18:33:58.146323	2026-02-05 18:33:58.146323	068d6117-87af-4ecd-a91c-741bdf6dc382
4ccc0c66-dcc9-466c-87c6-9f272a79a31c	quiz	intermediate	15	¿Qué operador verifica si dos valores son diferentes (valor y tipo)?	{"options": [{"id": "a", "text": "!="}, {"id": "b", "text": "!=="}, {"id": "c", "text": "<>"}, {"id": "d", "text": "=/="}], "explanation": "!== es el operador de desigualdad estricta", "correctAnswer": "b"}	0	t	2026-02-05 18:33:58.149676	2026-02-05 18:33:58.149676	068d6117-87af-4ecd-a91c-741bdf6dc382
332eb48c-3fca-4ab5-bbf1-e10c045b34af	fillBlank	beginner	10	Completa para verificar si x es mayor que 10:	{"hint": "El símbolo > significa 'mayor que'.", "blanks": [{"id": 0, "answers": [">", ">="]}], "template": ["if (x ", " 10) { }"], "explanation": "Si x es 11 o más, x > 10 será verdadero."}	0	t	2026-02-05 18:33:58.153324	2026-02-05 18:33:58.153324	068d6117-87af-4ecd-a91c-741bdf6dc382
201e6008-a2b9-4327-8e36-2ba85c18f758	fillBlank	beginner	10	Completa el bucle para contar del 0 al 9:	{"hint": "Para contar HASTA 9 (incluido), i debe ser MENOR que 10.", "blanks": [{"id": 0, "answers": ["<", "<="]}], "template": ["for (let i = 0; i ", " 10; i++) {\\n  console.log(i);\\n}"], "explanation": "El bucle se detiene cuando la condición i < 10 es falsa (i=10)."}	0	t	2026-02-05 18:33:58.15729	2026-02-05 18:33:58.15729	6568e1a0-554f-4f32-97a5-1af5b210b5ce
01c0a0a9-75d4-4312-929f-36c81b7a0fdc	code	beginner	10	Escribe un bucle for que imprima los números del 1 al 3	{"hint": "Inicia en 1, termina en 3, incrementa con i++", "solutions": ["for (let i = 1; i <= 3; i++)", "for(let i=1;i<=3;i++)", "for (let i = 1; i < 4; i++)"], "explanation": "Los bucles for son ideales cuando sabes cuántas veces repetir algo.", "placeholder": "// Escribe tu bucle for aquí\\n"}	0	t	2026-02-05 18:33:58.1613	2026-02-05 18:33:58.1613	6568e1a0-554f-4f32-97a5-1af5b210b5ce
e34d843c-6c31-402b-8fba-a3713ef24317	dragDrop	intermediate	15	Ordena para crear un bucle que recorra un array:	{"hint": "Primero declara el array, luego el bucle que lo recorre.", "items": [{"id": 1, "text": "let frutas = [\\"manzana\\", \\"pera\\"];"}, {"id": 2, "text": "for (let i = 0; i < frutas.length; i++) {"}, {"id": 3, "text": "  console.log(frutas[i]);"}, {"id": 4, "text": "}"}], "explanation": "Usamos frutas.length para recorrer todos los elementos dinámicamente.", "correctOrder": [1, 2, 3, 4]}	0	t	2026-02-05 18:33:58.164834	2026-02-05 18:33:58.164834	6568e1a0-554f-4f32-97a5-1af5b210b5ce
ab4241b4-1cc3-44ba-b912-bdf2b509e69c	code	advanced	25	Escribe un bucle for que sume los números del 1 al 10 en una variable "suma"	{"hint": "Usa += para acumular valores en suma", "solutions": ["suma += i", "suma = suma + i", "for (let i = 1; i <= 10"], "explanation": "El operador += es una forma corta de sumar y asignar (x = x + y).", "placeholder": "let suma = 0;\\n\\n// Escribe tu bucle aquí\\n"}	0	t	2026-02-05 18:33:58.168022	2026-02-05 18:33:58.168022	6568e1a0-554f-4f32-97a5-1af5b210b5ce
da16145d-c4f4-4122-9186-b70206ed167c	quiz	beginner	10	¿Qué pasa si olvidas incrementar el contador en un while?	{"options": [{"id": "a", "text": "El bucle no se ejecuta"}, {"id": "b", "text": "El bucle se ejecuta una vez"}, {"id": "c", "text": "Se crea un bucle infinito"}, {"id": "d", "text": "JavaScript lo incrementa automáticamente"}], "explanation": "Sin incrementar, la condición siempre será true", "correctAnswer": "c"}	0	t	2026-02-05 18:33:58.172311	2026-02-05 18:33:58.172311	3b948cda-d75a-42a0-99a2-7ab465176415
bb1f28b1-7a6d-4525-862b-c015fe83ca91	code	intermediate	15	Escribe un while que cuente del 0 al 4	{"hint": "No olvides incrementar i dentro del bucle!", "solutions": ["while (i < 5)", "while (i <= 4)", "while(i < 5)"], "explanation": "while repite el bloque mientras la condición sea verdadera.", "placeholder": "let i = 0;\\n\\n// Escribe tu bucle while aquí\\n"}	0	t	2026-02-05 18:33:58.176283	2026-02-05 18:33:58.176283	3b948cda-d75a-42a0-99a2-7ab465176415
3d3db0bb-5a71-4663-a27b-88c1c528dfc0	quiz	intermediate	15	¿Cuál es la diferencia entre while y do...while?	{"options": [{"id": "a", "text": "No hay diferencia"}, {"id": "b", "text": "do...while siempre ejecuta al menos una vez"}, {"id": "c", "text": "while es más rápido"}, {"id": "d", "text": "do...while no necesita condición"}], "explanation": "do...while evalúa la condición después de la primera ejecución", "correctAnswer": "b"}	0	t	2026-02-05 18:33:58.179061	2026-02-05 18:33:58.179061	3b948cda-d75a-42a0-99a2-7ab465176415
450abbfe-dfc7-4913-aebf-9ecbacbf4610	code	beginner	10	Crea una función llamada "duplicar" que reciba un número y retorne el doble	{"hint": "Usa return para devolver el resultado", "solutions": ["function duplicar(n) { return n * 2; }", "const duplicar = (n) => n * 2", "function duplicar(num) { return num * 2; }", "return n * 2", "return num * 2"], "explanation": "La palabra clave return finaliza la función y devuelve el valor.", "placeholder": "// Escribe tu función aquí\\n"}	0	t	2026-02-05 18:33:58.182835	2026-02-05 18:33:58.182835	075c215d-3d26-4770-860f-c5e9b6f67ee3
b87a039e-c679-4cc1-9862-e90ccc7cb00e	dragDrop	beginner	10	Ordena para crear una función que calcule el cuadrado:	{"hint": "Define la función, retorna el cálculo y cierra la llave.", "items": [{"id": 1, "text": "function cuadrado(n) {"}, {"id": 2, "text": "  return n * n;"}, {"id": 3, "text": "}"}], "explanation": "Las funciones encapsulan lógica reutilizable.", "correctOrder": [1, 2, 3]}	0	t	2026-02-05 18:33:58.18588	2026-02-05 18:33:58.18588	075c215d-3d26-4770-860f-c5e9b6f67ee3
af5045a2-4b0f-4af1-9fe3-ee098d4a7536	code	intermediate	15	Crea una función "saludar" que reciba un nombre y retorne "Hola, [nombre]"	{"hint": "Concatena \\"Hola, \\" con el parámetro nombre", "solutions": ["return \\"Hola, \\" + nombre", "return 'Hola, ' + nombre", "return `Hola, ${nombre}`"], "placeholder": "// Escribe tu función aquí\\n"}	0	t	2026-02-05 18:33:58.189202	2026-02-05 18:33:58.189202	075c215d-3d26-4770-860f-c5e9b6f67ee3
7a48fa53-193c-4fde-ab85-cc8339e99671	code	advanced	25	Crea una arrow function "sumar" que reciba dos números y retorne su suma	{"hint": "Formato: const nombre = (params) => expresión", "solutions": ["const sumar = (a, b) => a + b", "let sumar = (a, b) => a + b", "=> a + b"], "explanation": "Las arrow functions son más concisas para funciones simples.", "placeholder": "// Escribe tu arrow function aquí\\n"}	0	t	2026-02-05 18:33:58.192835	2026-02-05 18:33:58.192835	075c215d-3d26-4770-860f-c5e9b6f67ee3
afcb7856-08c9-4743-8367-3fe6e8162206	quiz	beginner	10	¿Qué retorna una función si no tiene return?	{"options": [{"id": "a", "text": "null"}, {"id": "b", "text": "0"}, {"id": "c", "text": "undefined"}, {"id": "d", "text": "Error"}], "explanation": "Sin return explícito, una función retorna undefined", "correctAnswer": "c"}	0	t	2026-02-05 18:33:58.196494	2026-02-05 18:33:58.196494	660e1c97-ff05-4992-a217-2bfb7819b515
5b6d5a13-4e05-4baf-8b5f-8f2cfaa84b83	fillBlank	beginner	10	Completa la función con parámetro por defecto:	{"hint": "Un valor común por defecto es 'Invitado' o 'Mundo'.", "blanks": [{"id": 0, "answers": ["Mundo", "Usuario", "Amigo", "Invitado"]}], "template": ["function saludar(nombre = \\"", "\\") {\\n  return \\"Hola \\" + nombre;\\n}"], "explanation": "Los parámetros por defecto se usan cuando no se pasa un argumento."}	0	t	2026-02-05 18:33:58.199111	2026-02-05 18:33:58.199111	660e1c97-ff05-4992-a217-2bfb7819b515
1473d458-fa70-42d8-9ecd-ae177928ca6e	code	intermediate	15	Crea una función "calcularArea" que reciba base y altura, y retorne el área del rectángulo	{"hint": "Área = base × altura", "solutions": ["return base * altura", "return altura * base", "base * altura"], "explanation": "Las funciones puras como esta siempre devuelven lo mismo para los mismos inputs.", "placeholder": "// Escribe tu función aquí\\n"}	0	t	2026-02-05 18:33:58.201583	2026-02-05 18:33:58.201583	660e1c97-ff05-4992-a217-2bfb7819b515
17906c8a-7fa0-4781-8b12-9f627c45f8ad	code	advanced	25	Crea una función "factorial" que calcule el factorial de un número usando recursión	{"hint": "Caso base: si n <= 1, retorna 1. Sino retorna n * factorial(n-1)", "solutions": ["return n * factorial(n - 1)", "factorial(n - 1)", "n * factorial(n-1)"], "explanation": "La recursión ocurre cuando una función se llama a sí misma.", "placeholder": "// Escribe tu función recursiva aquí\\n"}	0	t	2026-02-05 18:33:58.205241	2026-02-05 18:33:58.205241	660e1c97-ff05-4992-a217-2bfb7819b515
d47cfb69-2483-4ab9-b985-97d9bc5dbae0	quiz	advanced	20	¿Cuál es la salida de: ((x) => x * 2)(5)?	{"options": [{"id": "a", "text": "undefined"}, {"id": "b", "text": "5"}, {"id": "c", "text": "10"}, {"id": "d", "text": "Error de sintaxis"}], "explanation": "Es una IIFE (función invocada inmediatamente) que multiplica 5 por 2", "correctAnswer": "c"}	0	t	2026-02-05 18:33:58.209741	2026-02-05 18:33:58.209741	660e1c97-ff05-4992-a217-2bfb7819b515
ff894f53-4b23-48ce-8834-4c7b7963b5d8	quiz	beginner	10	Ejercicio 1 de Python Básico Lección 1	{"answer": "ok"}	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	ae646eb6-fa3d-4e55-87a2-70e72f6cfd81
1316de9e-6574-4c20-a42a-0a43f56c12f5	quiz	beginner	10	Ejercicio 2 de Python Básico Lección 1	{"answer": "ok"}	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	ae646eb6-fa3d-4e55-87a2-70e72f6cfd81
01926185-5835-46b9-8dbc-3b80c65a3ecb	quiz	beginner	10	Ejercicio 3 de Python Básico Lección 1	{"answer": "ok"}	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	ae646eb6-fa3d-4e55-87a2-70e72f6cfd81
15bc4080-cb9c-4c6c-b114-4fd22154d609	quiz	beginner	10	Ejercicio 4 de Python Básico Lección 1	{"answer": "ok"}	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	ae646eb6-fa3d-4e55-87a2-70e72f6cfd81
66464b25-dcf4-4ae2-883a-ac49e772d2d2	quiz	beginner	10	Ejercicio 5 de Python Básico Lección 1	{"answer": "ok"}	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	ae646eb6-fa3d-4e55-87a2-70e72f6cfd81
4403f20c-0a0b-4c3c-a0d9-75df2910f9a1	quiz	beginner	10	Ejercicio 1 de Python Básico Lección 2	{"answer": "ok"}	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	f39109ab-6c9b-419d-a516-aa464c9efca7
023e632e-2851-40cb-bd7b-adc30ae866b2	quiz	beginner	10	Ejercicio 2 de Python Básico Lección 2	{"answer": "ok"}	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	f39109ab-6c9b-419d-a516-aa464c9efca7
f46b9bfe-7474-46b8-a11b-c4290a64c249	quiz	beginner	10	Ejercicio 3 de Python Básico Lección 2	{"answer": "ok"}	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	f39109ab-6c9b-419d-a516-aa464c9efca7
5e16bd1e-52a9-45d6-9197-dbce234059bf	quiz	beginner	10	Ejercicio 4 de Python Básico Lección 2	{"answer": "ok"}	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	f39109ab-6c9b-419d-a516-aa464c9efca7
64ac387a-a68b-4e1f-a76d-373bc583e7c5	quiz	beginner	10	Ejercicio 5 de Python Básico Lección 2	{"answer": "ok"}	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	f39109ab-6c9b-419d-a516-aa464c9efca7
edb49563-2df5-4992-a041-60028282cb73	quiz	beginner	10	Ejercicio 1 de Python Básico Lección 3	{"answer": "ok"}	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	d420ad9f-ae93-4a4e-a638-845a48c9bc6e
a2e9d52b-86ee-4313-811f-bd7b2552e98e	quiz	beginner	10	Ejercicio 2 de Python Básico Lección 3	{"answer": "ok"}	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	d420ad9f-ae93-4a4e-a638-845a48c9bc6e
04ddde2a-aec7-4b98-aee2-da314dbd8133	quiz	beginner	10	Ejercicio 3 de Python Básico Lección 3	{"answer": "ok"}	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	d420ad9f-ae93-4a4e-a638-845a48c9bc6e
5976d434-152b-4dae-8455-9cd6e82b9764	quiz	beginner	10	Ejercicio 4 de Python Básico Lección 3	{"answer": "ok"}	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	d420ad9f-ae93-4a4e-a638-845a48c9bc6e
d6d500a6-73ba-43de-b30b-8abf09f4b60d	quiz	beginner	10	Ejercicio 5 de Python Básico Lección 3	{"answer": "ok"}	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	d420ad9f-ae93-4a4e-a638-845a48c9bc6e
3000b37b-95e1-4ce1-95aa-af145338ba1c	quiz	beginner	10	Ejercicio 1 de Python Básico Lección 4	{"answer": "ok"}	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	bf876f6c-2d43-4228-a83b-4ed4aca35293
b741139e-c40c-4f1d-ba7d-5c360627ca0c	quiz	beginner	10	Ejercicio 2 de Python Básico Lección 4	{"answer": "ok"}	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	bf876f6c-2d43-4228-a83b-4ed4aca35293
7d3e4a0b-1ab5-4e3c-bd28-fc8f31cd0cdb	quiz	beginner	10	Ejercicio 3 de Python Básico Lección 4	{"answer": "ok"}	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	bf876f6c-2d43-4228-a83b-4ed4aca35293
83d2e546-b89b-4596-a49d-df24714afaf5	quiz	beginner	10	Ejercicio 4 de Python Básico Lección 4	{"answer": "ok"}	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	bf876f6c-2d43-4228-a83b-4ed4aca35293
00dfb8ef-e304-42ea-aabb-2ef27b8e9116	quiz	beginner	10	Ejercicio 5 de Python Básico Lección 4	{"answer": "ok"}	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	bf876f6c-2d43-4228-a83b-4ed4aca35293
1bf7b030-b56e-45af-800a-d320ed47f56f	quiz	beginner	10	Ejercicio 1 de Python Básico Lección 5	{"answer": "ok"}	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	c9b66e7d-f433-4892-91b4-785f9400a7ff
2253d73d-d895-426b-8f56-caaf04a63ef8	quiz	beginner	10	Ejercicio 2 de Python Básico Lección 5	{"answer": "ok"}	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	c9b66e7d-f433-4892-91b4-785f9400a7ff
a989fc0e-7422-4bfd-a73f-4223560da537	quiz	beginner	10	Ejercicio 3 de Python Básico Lección 5	{"answer": "ok"}	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	c9b66e7d-f433-4892-91b4-785f9400a7ff
92a6e501-51b6-43a2-aac8-6cce1db6ec7d	quiz	beginner	10	Ejercicio 4 de Python Básico Lección 5	{"answer": "ok"}	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	c9b66e7d-f433-4892-91b4-785f9400a7ff
aaa6545e-6e16-4bd7-bb22-cd6528de32aa	quiz	beginner	10	Ejercicio 5 de Python Básico Lección 5	{"answer": "ok"}	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	c9b66e7d-f433-4892-91b4-785f9400a7ff
074f9f50-f322-4deb-ae7e-2d9e1f2211c2	quiz	beginner	10	Ejercicio 1 de Python Básico Lección 6	{"answer": "ok"}	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	79fe8a2a-3131-4611-bc9e-8daf27776783
ec0e7ba7-b790-4de3-befd-63ab68ea7cb1	quiz	beginner	10	Ejercicio 2 de Python Básico Lección 6	{"answer": "ok"}	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	79fe8a2a-3131-4611-bc9e-8daf27776783
75eac571-4393-43bb-b93d-0b3a314f35a4	quiz	beginner	10	Ejercicio 3 de Python Básico Lección 6	{"answer": "ok"}	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	79fe8a2a-3131-4611-bc9e-8daf27776783
8b4921d5-8310-4008-a5ec-23581a7638e0	quiz	beginner	10	Ejercicio 4 de Python Básico Lección 6	{"answer": "ok"}	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	79fe8a2a-3131-4611-bc9e-8daf27776783
07239bbb-4a6b-47b3-8574-83462b619e5a	quiz	beginner	10	Ejercicio 5 de Python Básico Lección 6	{"answer": "ok"}	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	79fe8a2a-3131-4611-bc9e-8daf27776783
60a689b4-b524-4483-beaf-83eb91233f8c	quiz	beginner	10	Ejercicio 1 de Python Intermedio Lección 1	{"answer": "ok"}	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	b0331d8d-b9ad-427b-ad85-9016ec8011ab
a78b63f9-7a66-48fe-ae6c-ab4d65c17d73	quiz	beginner	10	Ejercicio 2 de Python Intermedio Lección 1	{"answer": "ok"}	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	b0331d8d-b9ad-427b-ad85-9016ec8011ab
4b88b2f8-3829-4fc8-aeb9-cf5d28f687b4	quiz	beginner	10	Ejercicio 3 de Python Intermedio Lección 1	{"answer": "ok"}	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	b0331d8d-b9ad-427b-ad85-9016ec8011ab
18fc45e1-3dda-4814-a6aa-e9515ea72f9b	quiz	beginner	10	Ejercicio 4 de Python Intermedio Lección 1	{"answer": "ok"}	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	b0331d8d-b9ad-427b-ad85-9016ec8011ab
0d08b85b-2b68-412a-9dde-a77549deaf42	quiz	beginner	10	Ejercicio 5 de Python Intermedio Lección 1	{"answer": "ok"}	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	b0331d8d-b9ad-427b-ad85-9016ec8011ab
43699e39-73bc-4081-b476-07aca489182e	quiz	beginner	10	Ejercicio 1 de Python Intermedio Lección 2	{"answer": "ok"}	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	4a5a7c7b-50ae-45b9-be8c-dda35b9195c8
bf6bacbf-cfd5-46c8-9913-eb0f090515dd	quiz	beginner	10	Ejercicio 2 de Python Intermedio Lección 2	{"answer": "ok"}	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	4a5a7c7b-50ae-45b9-be8c-dda35b9195c8
952d5cb8-0a54-40d7-96dd-0dd415489998	quiz	beginner	10	Ejercicio 3 de Python Intermedio Lección 2	{"answer": "ok"}	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	4a5a7c7b-50ae-45b9-be8c-dda35b9195c8
22db522d-3dc4-4ad9-befe-2e33ea02efa8	quiz	beginner	10	Ejercicio 4 de Python Intermedio Lección 2	{"answer": "ok"}	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	4a5a7c7b-50ae-45b9-be8c-dda35b9195c8
91458124-7ba9-4be0-b108-8c3b1649f4fd	quiz	beginner	10	Ejercicio 5 de Python Intermedio Lección 2	{"answer": "ok"}	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	4a5a7c7b-50ae-45b9-be8c-dda35b9195c8
c603c66b-ae28-4fc9-a73b-83b0e94aebd1	quiz	beginner	10	Ejercicio 1 de Python Intermedio Lección 3	{"answer": "ok"}	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	8326970b-9354-4958-9eeb-9217dc135c26
cb0af85f-8b11-4fb6-8a84-d18a694b2466	quiz	beginner	10	Ejercicio 2 de Python Intermedio Lección 3	{"answer": "ok"}	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	8326970b-9354-4958-9eeb-9217dc135c26
88791f54-7d0c-4e1a-a7a0-5cdc5bcaf234	quiz	beginner	10	Ejercicio 3 de Python Intermedio Lección 3	{"answer": "ok"}	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	8326970b-9354-4958-9eeb-9217dc135c26
616cd452-4b77-4ed5-b920-1e746fdb2fa6	quiz	beginner	10	Ejercicio 4 de Python Intermedio Lección 3	{"answer": "ok"}	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	8326970b-9354-4958-9eeb-9217dc135c26
da020dcf-1ae9-4895-8cf0-7f1c3d3ddcab	quiz	beginner	10	Ejercicio 5 de Python Intermedio Lección 3	{"answer": "ok"}	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	8326970b-9354-4958-9eeb-9217dc135c26
62ba2547-0441-46b8-81db-c22f4187e4ff	quiz	beginner	10	Ejercicio 1 de Python Intermedio Lección 4	{"answer": "ok"}	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	f564fa23-e30e-4821-962a-16de83162a1c
2707c58f-2da4-4556-83af-fa073b11f4be	quiz	beginner	10	Ejercicio 2 de Python Intermedio Lección 4	{"answer": "ok"}	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	f564fa23-e30e-4821-962a-16de83162a1c
7b8795cb-b624-46ed-a7f0-8fc9adb0881b	quiz	beginner	10	Ejercicio 3 de Python Intermedio Lección 4	{"answer": "ok"}	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	f564fa23-e30e-4821-962a-16de83162a1c
ecb948f2-75e1-4d62-923e-43e51496ee5a	quiz	beginner	10	Ejercicio 4 de Python Intermedio Lección 4	{"answer": "ok"}	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	f564fa23-e30e-4821-962a-16de83162a1c
7f819338-7a34-4781-b577-78e295a4a629	quiz	beginner	10	Ejercicio 5 de Python Intermedio Lección 4	{"answer": "ok"}	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	f564fa23-e30e-4821-962a-16de83162a1c
71ecc0f5-eece-4a4a-bf3e-1bdb22086ed4	quiz	beginner	10	Ejercicio 1 de Python Intermedio Lección 5	{"answer": "ok"}	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	b0dbb4c2-ef6b-462a-b0bf-7a87ced68b4b
c14870f8-ee03-42af-bfba-8cf45f37a8fe	quiz	beginner	10	Ejercicio 2 de Python Intermedio Lección 5	{"answer": "ok"}	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	b0dbb4c2-ef6b-462a-b0bf-7a87ced68b4b
54df3ddb-2bba-4f32-867e-c3763c1d5b44	quiz	beginner	10	Ejercicio 3 de Python Intermedio Lección 5	{"answer": "ok"}	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	b0dbb4c2-ef6b-462a-b0bf-7a87ced68b4b
a8fae982-2b69-4c60-ac8f-3a65327db33c	quiz	beginner	10	Ejercicio 4 de Python Intermedio Lección 5	{"answer": "ok"}	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	b0dbb4c2-ef6b-462a-b0bf-7a87ced68b4b
e9af71ad-e55f-4352-8a90-5164bbc971f9	quiz	beginner	10	Ejercicio 5 de Python Intermedio Lección 5	{"answer": "ok"}	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	b0dbb4c2-ef6b-462a-b0bf-7a87ced68b4b
f506c5d2-ddb6-46d2-9062-82822dc20653	quiz	beginner	10	Ejercicio 1 de Python Intermedio Lección 6	{"answer": "ok"}	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	6a442e91-c44e-4dc8-860c-af6f8188f4c4
4adbfc2e-9b40-4959-96d1-3c2634030923	quiz	beginner	10	Ejercicio 2 de Python Intermedio Lección 6	{"answer": "ok"}	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	6a442e91-c44e-4dc8-860c-af6f8188f4c4
a8b93472-97f7-4f49-b257-d901ddeee1ab	quiz	beginner	10	Ejercicio 3 de Python Intermedio Lección 6	{"answer": "ok"}	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	6a442e91-c44e-4dc8-860c-af6f8188f4c4
2621eab3-3042-41a8-967d-074cac5a4fd3	quiz	beginner	10	Ejercicio 4 de Python Intermedio Lección 6	{"answer": "ok"}	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	6a442e91-c44e-4dc8-860c-af6f8188f4c4
a736ca10-67dc-48b2-be48-55cd417fa115	quiz	beginner	10	Ejercicio 5 de Python Intermedio Lección 6	{"answer": "ok"}	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	6a442e91-c44e-4dc8-860c-af6f8188f4c4
8ae93a9f-59c1-45f2-ab8c-ffc941d9d664	quiz	beginner	10	Ejercicio 1 de C# Básico Lección 1	{"answer": "ok"}	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	5064edad-6b29-4553-89e8-ab155729c6cc
d7f48d35-0f0c-44b6-bda3-226fe02858b6	quiz	beginner	10	Ejercicio 2 de C# Básico Lección 1	{"answer": "ok"}	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	5064edad-6b29-4553-89e8-ab155729c6cc
4209c0c6-5b77-43ef-a1c3-09d8079f9aa9	quiz	beginner	10	Ejercicio 3 de C# Básico Lección 1	{"answer": "ok"}	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	5064edad-6b29-4553-89e8-ab155729c6cc
a6c0ccd3-741d-4584-bd51-9974003bc9be	quiz	beginner	10	Ejercicio 4 de C# Básico Lección 1	{"answer": "ok"}	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	5064edad-6b29-4553-89e8-ab155729c6cc
4638cbbe-5407-4007-864b-6fdad218bb63	quiz	beginner	10	Ejercicio 5 de C# Básico Lección 1	{"answer": "ok"}	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	5064edad-6b29-4553-89e8-ab155729c6cc
53a713a8-207f-4e29-b68f-cb133b92614f	quiz	beginner	10	Ejercicio 1 de C# Básico Lección 2	{"answer": "ok"}	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	ed097a2b-1e91-4d60-9bb3-8a9a550b7a95
14ff20d2-ce83-440e-a257-7d65f3e9071a	quiz	beginner	10	Ejercicio 2 de C# Básico Lección 2	{"answer": "ok"}	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	ed097a2b-1e91-4d60-9bb3-8a9a550b7a95
f74b4021-f687-4ca3-97d9-53cfcb155e92	quiz	beginner	10	Ejercicio 3 de C# Básico Lección 2	{"answer": "ok"}	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	ed097a2b-1e91-4d60-9bb3-8a9a550b7a95
8deff2af-68bb-4688-90da-eface547e855	quiz	beginner	10	Ejercicio 4 de C# Básico Lección 2	{"answer": "ok"}	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	ed097a2b-1e91-4d60-9bb3-8a9a550b7a95
32f0a755-a4d4-45f9-93cf-96666a38892f	quiz	beginner	10	Ejercicio 5 de C# Básico Lección 2	{"answer": "ok"}	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	ed097a2b-1e91-4d60-9bb3-8a9a550b7a95
f3f68f30-b3af-44d4-9fb9-f79efce318c2	quiz	beginner	10	Ejercicio 1 de C# Básico Lección 3	{"answer": "ok"}	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	5f8cfb5b-c895-4564-bf20-ed001681c745
34d97742-6fec-4977-b120-9bd688d03100	quiz	beginner	10	Ejercicio 2 de C# Básico Lección 3	{"answer": "ok"}	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	5f8cfb5b-c895-4564-bf20-ed001681c745
01d89a4e-aa8a-4d9c-85e5-0e0083a3c180	quiz	beginner	10	Ejercicio 3 de C# Básico Lección 3	{"answer": "ok"}	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	5f8cfb5b-c895-4564-bf20-ed001681c745
7cd0d104-7ac3-40ce-a9ef-8e85af59afd2	quiz	beginner	10	Ejercicio 4 de C# Básico Lección 3	{"answer": "ok"}	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	5f8cfb5b-c895-4564-bf20-ed001681c745
7b234198-04dc-4b65-827b-6e8024e4a6b9	quiz	beginner	10	Ejercicio 5 de C# Básico Lección 3	{"answer": "ok"}	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	5f8cfb5b-c895-4564-bf20-ed001681c745
ad494f66-b7d6-4677-88c4-d993600017a4	quiz	beginner	10	Ejercicio 1 de C# Básico Lección 4	{"answer": "ok"}	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	67a70284-5304-4d40-a1a0-aac647850cea
f46abf85-cf1c-43a1-961e-6c84dd7dcd90	quiz	beginner	10	Ejercicio 2 de C# Básico Lección 4	{"answer": "ok"}	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	67a70284-5304-4d40-a1a0-aac647850cea
0d301270-844f-4b77-9cd8-57924b30e2bd	quiz	beginner	10	Ejercicio 3 de C# Básico Lección 4	{"answer": "ok"}	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	67a70284-5304-4d40-a1a0-aac647850cea
bfa7dffe-86fa-46a0-aa57-622664ce1147	quiz	beginner	10	Ejercicio 4 de C# Básico Lección 4	{"answer": "ok"}	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	67a70284-5304-4d40-a1a0-aac647850cea
dad1ddae-5a30-424b-8a78-0bea01820143	quiz	beginner	10	Ejercicio 5 de C# Básico Lección 4	{"answer": "ok"}	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	67a70284-5304-4d40-a1a0-aac647850cea
a06b1691-a71a-4ce2-af3a-5fd79d9b3ae2	quiz	beginner	10	Ejercicio 1 de C# Básico Lección 5	{"answer": "ok"}	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	bf8eadde-b513-4bc0-b733-96bc7310ba5f
d334ee22-15b6-4e8d-9aaf-c8129860217d	quiz	beginner	10	Ejercicio 2 de C# Básico Lección 5	{"answer": "ok"}	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	bf8eadde-b513-4bc0-b733-96bc7310ba5f
b2325443-3ae5-44c3-a8b8-d59656b9e8e6	quiz	beginner	10	Ejercicio 3 de C# Básico Lección 5	{"answer": "ok"}	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	bf8eadde-b513-4bc0-b733-96bc7310ba5f
9be4ba49-57c7-488c-99b0-5384cbf98de7	quiz	beginner	10	Ejercicio 4 de C# Básico Lección 5	{"answer": "ok"}	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	bf8eadde-b513-4bc0-b733-96bc7310ba5f
5b818446-63df-4969-bbc3-812fa5d6b49f	quiz	beginner	10	Ejercicio 5 de C# Básico Lección 5	{"answer": "ok"}	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	bf8eadde-b513-4bc0-b733-96bc7310ba5f
3b18bca1-6ed8-435d-a9f3-4beb917ca4bd	quiz	beginner	10	Ejercicio 1 de C# Básico Lección 6	{"answer": "ok"}	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	3b24e104-e4ca-4552-89d3-25338870f837
60270286-af15-4352-9d68-d4df0da93be5	quiz	beginner	10	Ejercicio 2 de C# Básico Lección 6	{"answer": "ok"}	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	3b24e104-e4ca-4552-89d3-25338870f837
b844bf10-cf12-492e-8ad3-955794e12cf2	quiz	beginner	10	Ejercicio 3 de C# Básico Lección 6	{"answer": "ok"}	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	3b24e104-e4ca-4552-89d3-25338870f837
71a99bd2-defc-4e76-a4f4-c0c01d25aaaf	quiz	beginner	10	Ejercicio 4 de C# Básico Lección 6	{"answer": "ok"}	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	3b24e104-e4ca-4552-89d3-25338870f837
dd8c9c63-f905-4568-a429-9f536a3c85cb	quiz	beginner	10	Ejercicio 5 de C# Básico Lección 6	{"answer": "ok"}	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	3b24e104-e4ca-4552-89d3-25338870f837
a527de1a-74ff-4965-aaa4-80157c80acfc	quiz	beginner	10	Ejercicio 1 de Java Básico Lección 1	{"answer": "ok"}	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	7ed7991a-fe63-479b-a3c3-742509f4a0fc
69151164-13ea-4e85-b10f-0ea666c67bb4	quiz	beginner	10	Ejercicio 2 de Java Básico Lección 1	{"answer": "ok"}	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	7ed7991a-fe63-479b-a3c3-742509f4a0fc
7890dc7e-e3a1-4460-a9fe-ab0da535af56	quiz	beginner	10	Ejercicio 3 de Java Básico Lección 1	{"answer": "ok"}	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	7ed7991a-fe63-479b-a3c3-742509f4a0fc
d85070d9-405b-42e8-802a-6229e962c4fd	quiz	beginner	10	Ejercicio 4 de Java Básico Lección 1	{"answer": "ok"}	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	7ed7991a-fe63-479b-a3c3-742509f4a0fc
b490f616-91a2-4046-8eb5-f877e9852e54	quiz	beginner	10	Ejercicio 5 de Java Básico Lección 1	{"answer": "ok"}	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	7ed7991a-fe63-479b-a3c3-742509f4a0fc
df4de8b2-d6df-4e2b-a491-f42ef37d0bbb	quiz	beginner	10	Ejercicio 1 de Java Básico Lección 2	{"answer": "ok"}	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	915a272f-aea4-4dbe-85d3-082e0522815d
53993a52-68ef-4f3d-a4d4-40e7b89bd9f3	quiz	beginner	10	Ejercicio 2 de Java Básico Lección 2	{"answer": "ok"}	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	915a272f-aea4-4dbe-85d3-082e0522815d
b5b3310c-ce44-483d-a79f-2440fee33eea	quiz	beginner	10	Ejercicio 3 de Java Básico Lección 2	{"answer": "ok"}	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	915a272f-aea4-4dbe-85d3-082e0522815d
1faac7ca-1ca8-4df1-a062-45d62f2c39db	quiz	beginner	10	Ejercicio 4 de Java Básico Lección 2	{"answer": "ok"}	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	915a272f-aea4-4dbe-85d3-082e0522815d
b34103e1-dae6-4b94-b4df-5273b9e89b4a	quiz	beginner	10	Ejercicio 5 de Java Básico Lección 2	{"answer": "ok"}	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	915a272f-aea4-4dbe-85d3-082e0522815d
0b3a37d6-d54d-41b4-8f58-aaab734ab137	quiz	beginner	10	Ejercicio 1 de Java Básico Lección 3	{"answer": "ok"}	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	92bc2954-4468-4d1c-ba30-6b641b8deae3
91b39715-06e8-4e8d-b2af-7609a436bf40	quiz	beginner	10	Ejercicio 2 de Java Básico Lección 3	{"answer": "ok"}	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	92bc2954-4468-4d1c-ba30-6b641b8deae3
ee0a9c36-690c-424d-99ec-b4b910e12360	quiz	beginner	10	Ejercicio 3 de Java Básico Lección 3	{"answer": "ok"}	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	92bc2954-4468-4d1c-ba30-6b641b8deae3
d72a415d-9361-4e8f-9218-13195e98e2c7	quiz	beginner	10	Ejercicio 4 de Java Básico Lección 3	{"answer": "ok"}	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	92bc2954-4468-4d1c-ba30-6b641b8deae3
d2439078-36fd-4d22-bef4-b279306c487e	quiz	beginner	10	Ejercicio 5 de Java Básico Lección 3	{"answer": "ok"}	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	92bc2954-4468-4d1c-ba30-6b641b8deae3
a93db47c-4999-481d-9e5c-2dd0f0c9042a	quiz	beginner	10	Ejercicio 1 de Java Básico Lección 4	{"answer": "ok"}	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	b8ea943e-0ab3-4c03-8afa-29e7a2ce6b3f
b382eaf0-a915-448f-8360-1e0db398c55f	quiz	beginner	10	Ejercicio 2 de Java Básico Lección 4	{"answer": "ok"}	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	b8ea943e-0ab3-4c03-8afa-29e7a2ce6b3f
9fbd26ba-0bb9-439c-990a-81393b83dd8a	quiz	beginner	10	Ejercicio 3 de Java Básico Lección 4	{"answer": "ok"}	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	b8ea943e-0ab3-4c03-8afa-29e7a2ce6b3f
2385ec52-1ce6-473d-a540-0597456edfc8	quiz	beginner	10	Ejercicio 4 de Java Básico Lección 4	{"answer": "ok"}	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	b8ea943e-0ab3-4c03-8afa-29e7a2ce6b3f
215fbc01-cc7e-439b-9b69-f14a4ddd7ae1	quiz	beginner	10	Ejercicio 5 de Java Básico Lección 4	{"answer": "ok"}	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	b8ea943e-0ab3-4c03-8afa-29e7a2ce6b3f
fa3b3d12-7037-4e8f-af22-7e59e3397670	quiz	beginner	10	Ejercicio 1 de Java Básico Lección 5	{"answer": "ok"}	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	0928894b-d148-4a36-affd-7c55fc7b360e
bf349908-62de-4d01-aef8-a75f8652fcfe	quiz	beginner	10	Ejercicio 2 de Java Básico Lección 5	{"answer": "ok"}	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	0928894b-d148-4a36-affd-7c55fc7b360e
382f3a95-70ae-40b9-839b-b3d214cad86f	quiz	beginner	10	Ejercicio 3 de Java Básico Lección 5	{"answer": "ok"}	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	0928894b-d148-4a36-affd-7c55fc7b360e
24670c5e-5dc3-4e46-976a-d9ba1078d9fc	quiz	beginner	10	Ejercicio 4 de Java Básico Lección 5	{"answer": "ok"}	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	0928894b-d148-4a36-affd-7c55fc7b360e
01a312b8-799d-4f62-beed-c43f816486e0	quiz	beginner	10	Ejercicio 5 de Java Básico Lección 5	{"answer": "ok"}	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	0928894b-d148-4a36-affd-7c55fc7b360e
78e61b5e-ed29-4c8b-884a-6f977b53d484	quiz	beginner	10	Ejercicio 1 de Java Básico Lección 6	{"answer": "ok"}	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	21ac29e0-b15a-4649-baeb-08d95a6d412f
f3f0342c-5b28-4ba8-8b84-6ea5cb20bc74	quiz	beginner	10	Ejercicio 2 de Java Básico Lección 6	{"answer": "ok"}	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	21ac29e0-b15a-4649-baeb-08d95a6d412f
72c08c55-be2d-4499-b972-9672fda59a56	quiz	beginner	10	Ejercicio 3 de Java Básico Lección 6	{"answer": "ok"}	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	21ac29e0-b15a-4649-baeb-08d95a6d412f
0a549a78-2952-4f10-9b38-c5bf3056479a	quiz	beginner	10	Ejercicio 4 de Java Básico Lección 6	{"answer": "ok"}	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	21ac29e0-b15a-4649-baeb-08d95a6d412f
006e973e-e854-40cc-84c1-f1e67f76119f	quiz	beginner	10	Ejercicio 5 de Java Básico Lección 6	{"answer": "ok"}	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	21ac29e0-b15a-4649-baeb-08d95a6d412f
2edab8bd-19b3-4cfe-bb6c-2e36a8d6afcd	quiz	beginner	10	Ejercicio 1 de JavaScript Avanzado Lección 1	{"answer": "ok"}	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	aff7ca11-8cff-48dc-9b3d-691de68315a0
35a3a950-9bc7-4153-912e-12c7c916729e	quiz	beginner	10	Ejercicio 2 de JavaScript Avanzado Lección 1	{"answer": "ok"}	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	aff7ca11-8cff-48dc-9b3d-691de68315a0
be1d096c-d7ad-432f-9028-6fd8f75bdac7	quiz	beginner	10	Ejercicio 3 de JavaScript Avanzado Lección 1	{"answer": "ok"}	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	aff7ca11-8cff-48dc-9b3d-691de68315a0
ff335fe3-dca3-4768-860c-27a30193a12a	quiz	beginner	10	Ejercicio 4 de JavaScript Avanzado Lección 1	{"answer": "ok"}	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	aff7ca11-8cff-48dc-9b3d-691de68315a0
58d584bc-7e65-487e-a510-498806b32b40	quiz	beginner	10	Ejercicio 5 de JavaScript Avanzado Lección 1	{"answer": "ok"}	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	aff7ca11-8cff-48dc-9b3d-691de68315a0
95f30374-dd94-4293-937b-f28f325e814d	quiz	beginner	10	Ejercicio 1 de JavaScript Avanzado Lección 2	{"answer": "ok"}	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	2c024d96-379b-4ff4-8651-add80cbffdf5
e7eab7f5-f4dd-4190-bf5a-70132725f2b9	quiz	beginner	10	Ejercicio 2 de JavaScript Avanzado Lección 2	{"answer": "ok"}	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	2c024d96-379b-4ff4-8651-add80cbffdf5
16517e53-9f41-4f01-97a6-67e497d2c1af	quiz	beginner	10	Ejercicio 3 de JavaScript Avanzado Lección 2	{"answer": "ok"}	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	2c024d96-379b-4ff4-8651-add80cbffdf5
5ad973a2-3fcf-42b4-8985-cc9967b4b7a6	quiz	beginner	10	Ejercicio 4 de JavaScript Avanzado Lección 2	{"answer": "ok"}	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	2c024d96-379b-4ff4-8651-add80cbffdf5
32245e80-7e9d-41cd-9c13-e8e761837387	quiz	beginner	10	Ejercicio 5 de JavaScript Avanzado Lección 2	{"answer": "ok"}	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	2c024d96-379b-4ff4-8651-add80cbffdf5
c99972e3-0302-43e7-bf53-b27da5474ddb	quiz	beginner	10	Ejercicio 1 de JavaScript Avanzado Lección 3	{"answer": "ok"}	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	3f97a898-6b10-4a74-b618-8f0960399f7b
fa589e1b-2cdc-4b4a-b2c1-dca3e1a1a244	quiz	beginner	10	Ejercicio 2 de JavaScript Avanzado Lección 3	{"answer": "ok"}	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	3f97a898-6b10-4a74-b618-8f0960399f7b
06976bce-40b7-4860-9ddd-9d6fe5a6cd22	quiz	beginner	10	Ejercicio 3 de JavaScript Avanzado Lección 3	{"answer": "ok"}	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	3f97a898-6b10-4a74-b618-8f0960399f7b
d1c1c1cc-df7e-4161-b6ca-eab7fdbd636f	quiz	beginner	10	Ejercicio 4 de JavaScript Avanzado Lección 3	{"answer": "ok"}	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	3f97a898-6b10-4a74-b618-8f0960399f7b
bd6d2f9f-f9ed-4d59-abd8-5d356ba02dd6	quiz	beginner	10	Ejercicio 5 de JavaScript Avanzado Lección 3	{"answer": "ok"}	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	3f97a898-6b10-4a74-b618-8f0960399f7b
e69e9261-e174-4f48-a94d-fbd2313773d6	quiz	beginner	10	Ejercicio 1 de JavaScript Avanzado Lección 4	{"answer": "ok"}	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	37c5e2a6-ddee-46a4-b8ad-5670a9813116
e128c0cc-b295-48a4-9d5e-53cf1a606cc5	quiz	beginner	10	Ejercicio 2 de JavaScript Avanzado Lección 4	{"answer": "ok"}	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	37c5e2a6-ddee-46a4-b8ad-5670a9813116
8e125ed8-9e3a-4fa4-8483-a01eaaa2351e	quiz	beginner	10	Ejercicio 3 de JavaScript Avanzado Lección 4	{"answer": "ok"}	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	37c5e2a6-ddee-46a4-b8ad-5670a9813116
8a36fc62-b672-4e4d-93a9-a67cf584c58f	quiz	beginner	10	Ejercicio 4 de JavaScript Avanzado Lección 4	{"answer": "ok"}	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	37c5e2a6-ddee-46a4-b8ad-5670a9813116
9764e37a-4e63-415d-9eea-0beb4b76ff0d	quiz	beginner	10	Ejercicio 5 de JavaScript Avanzado Lección 4	{"answer": "ok"}	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	37c5e2a6-ddee-46a4-b8ad-5670a9813116
063acca7-362c-43f2-bf5f-d68e62d8f6f9	quiz	beginner	10	Ejercicio 1 de JavaScript Avanzado Lección 5	{"answer": "ok"}	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	5344f783-1de6-4a08-86b0-506c5fc6b9b1
345b834d-659a-43de-bbb1-f53321b9dcd0	quiz	beginner	10	Ejercicio 2 de JavaScript Avanzado Lección 5	{"answer": "ok"}	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	5344f783-1de6-4a08-86b0-506c5fc6b9b1
40b57e68-6296-4d05-b1d4-29ba0649541d	quiz	beginner	10	Ejercicio 3 de JavaScript Avanzado Lección 5	{"answer": "ok"}	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	5344f783-1de6-4a08-86b0-506c5fc6b9b1
b4adc062-78c6-480e-9230-13dc3e299505	quiz	beginner	10	Ejercicio 4 de JavaScript Avanzado Lección 5	{"answer": "ok"}	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	5344f783-1de6-4a08-86b0-506c5fc6b9b1
e5e7c267-868a-4294-a340-1bef87d092aa	quiz	beginner	10	Ejercicio 5 de JavaScript Avanzado Lección 5	{"answer": "ok"}	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	5344f783-1de6-4a08-86b0-506c5fc6b9b1
c1e53d73-d9db-419c-8760-fa5d624445e7	quiz	beginner	10	Ejercicio 1 de JavaScript Avanzado Lección 6	{"answer": "ok"}	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	b6db9a9d-b6b7-40f1-92dc-94ca8d689820
05ddf45b-9954-430c-9ab3-d636f602e1cf	quiz	beginner	10	Ejercicio 2 de JavaScript Avanzado Lección 6	{"answer": "ok"}	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	b6db9a9d-b6b7-40f1-92dc-94ca8d689820
6b32b198-f413-40f7-b376-06f5a043c954	quiz	beginner	10	Ejercicio 3 de JavaScript Avanzado Lección 6	{"answer": "ok"}	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	b6db9a9d-b6b7-40f1-92dc-94ca8d689820
a27b3256-10a6-456c-9dd9-a501c2bcd6c2	quiz	beginner	10	Ejercicio 4 de JavaScript Avanzado Lección 6	{"answer": "ok"}	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	b6db9a9d-b6b7-40f1-92dc-94ca8d689820
f27bc51f-b590-4bac-928d-b719be4674d7	quiz	beginner	10	Ejercicio 5 de JavaScript Avanzado Lección 6	{"answer": "ok"}	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	b6db9a9d-b6b7-40f1-92dc-94ca8d689820
aad45c13-3f0c-414d-b4f6-fbc5ca997eaa	code	beginner	10	Crea una función llamada "suma" que reciba dos números y retorne su suma.	{"hint": "Usa return a + b dentro de tu función", "explanation": "Una función puede recibir parámetros y retornar el resultado de operar con ellos.", "placeholder": "// Escribe tu función aquí\\n"}	0	t	2026-02-27 16:30:21.583799	2026-02-27 16:30:21.583799	660e1c97-ff05-4992-a217-2bfb7819b515
8bd83ac8-18e9-4214-8304-8b167e77699c	code	intermediate	20	Crea una función llamada "esPrimo" que reciba un número entero positivo y retorne true si es primo, false si no lo es.	{"hint": "Un número primo solo es divisible por 1 y por sí mismo. Prueba dividiendo desde 2 hasta Math.sqrt(n)", "explanation": "Los números primos son fundamentales en matemáticas y criptografía. El truco de sqrt(n) optimiza la búsqueda de divisores.", "placeholder": "// Escribe tu función aquí\\n"}	0	t	2026-02-27 16:30:21.657541	2026-02-27 16:30:21.657541	660e1c97-ff05-4992-a217-2bfb7819b515
0ca10781-9822-43f1-9a25-e021c87e3aae	code	intermediate	20	Crea una función llamada "invertirString" que reciba un string y retorne el string invertido.	{"hint": "Tip: puedes usar .split(\\"\\"), .reverse() y .join(\\"\\") encadenados", "explanation": "Invertir strings es un clásico ejercicio de manipulación de cadenas. El método de split/reverse/join es la forma más idiomática en JavaScript.", "placeholder": "// Escribe tu función aquí\\n"}	0	t	2026-02-27 16:30:21.711726	2026-02-27 16:30:21.711726	660e1c97-ff05-4992-a217-2bfb7819b515
4f883cb2-377a-4896-b7a6-8faef7e96c6b	code	advanced	30	Crea una función llamada "fibonacci" que reciba un entero n (≥ 0) y retorne el n-ésimo número de la secuencia de Fibonacci. (fibonacci(0) = 0, fibonacci(1) = 1, fibonacci(2) = 1, fibonacci(5) = 5)	{"hint": "Puedes usar recursión (caso base: n <= 1) o un bucle iterativo. La solución iterativa es más eficiente.", "explanation": "La secuencia de Fibonacci aparece en muchos fenómenos naturales. La implementación iterativa evita el stackoverflow de la recursiva para valores grandes de n.", "placeholder": "// Escribe tu función aquí\\n"}	0	t	2026-02-27 16:30:21.759223	2026-02-27 16:30:21.759223	660e1c97-ff05-4992-a217-2bfb7819b515
\.


--
-- Data for Name: lessons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lessons (id, title, description, "order", is_active, created_at, updated_at, module_id) FROM stdin;
09e913f9-5646-47c7-a721-172fb3d0a57e	¿Qué son las variables?	Introducción a variables	1	t	2026-02-05 18:33:58.061611	2026-02-05 18:33:58.061611	65bd187b-73ef-4457-b79a-d7b15ee219c7
f7bc894a-4e9b-40bf-bcb1-e4e92acea017	Tipos de Datos	String, Number, Boolean, etc.	2	t	2026-02-05 18:33:58.067496	2026-02-05 18:33:58.067496	65bd187b-73ef-4457-b79a-d7b15ee219c7
016fdff1-5599-4749-a582-5e945ac6bc4f	Estructura if/else	Toma de decisiones básica	1	t	2026-02-05 18:33:58.075587	2026-02-05 18:33:58.075587	45eec4d1-1a3d-402b-b8fc-c1103db1f7f8
068d6117-87af-4ecd-a91c-741bdf6dc382	Operadores de Comparación	Comparar valores	2	t	2026-02-05 18:33:58.080414	2026-02-05 18:33:58.080414	45eec4d1-1a3d-402b-b8fc-c1103db1f7f8
6568e1a0-554f-4f32-97a5-1af5b210b5ce	Bucle For	Iteraciones controladas	1	t	2026-02-05 18:33:58.085707	2026-02-05 18:33:58.085707	89ed617a-add1-4ca8-adb2-03d3ec8c09db
3b948cda-d75a-42a0-99a2-7ab465176415	Bucle While	Iteraciones condicionales	2	t	2026-02-05 18:33:58.089345	2026-02-05 18:33:58.089345	89ed617a-add1-4ca8-adb2-03d3ec8c09db
075c215d-3d26-4770-860f-c5e9b6f67ee3	Crear Funciones	Definición y uso de funciones	1	t	2026-02-05 18:33:58.098582	2026-02-05 18:33:58.098582	2d30e9b6-5e59-4889-8f4f-c957269480db
660e1c97-ff05-4992-a217-2bfb7819b515	Parámetros y Retorno	Entrada y salida de datos	2	t	2026-02-05 18:33:58.102075	2026-02-05 18:33:58.102075	2d30e9b6-5e59-4889-8f4f-c957269480db
ae646eb6-fa3d-4e55-87a2-70e72f6cfd81	Python Básico - Lección 1	Contenido 1	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	ae2533b7-3531-4d1d-9614-3200c838f913
f39109ab-6c9b-419d-a516-aa464c9efca7	Python Básico - Lección 2	Contenido 2	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	ae2533b7-3531-4d1d-9614-3200c838f913
d420ad9f-ae93-4a4e-a638-845a48c9bc6e	Python Básico - Lección 3	Contenido 3	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	ae2533b7-3531-4d1d-9614-3200c838f913
bf876f6c-2d43-4228-a83b-4ed4aca35293	Python Básico - Lección 4	Contenido 4	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	ae2533b7-3531-4d1d-9614-3200c838f913
c9b66e7d-f433-4892-91b4-785f9400a7ff	Python Básico - Lección 5	Contenido 5	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	ae2533b7-3531-4d1d-9614-3200c838f913
79fe8a2a-3131-4611-bc9e-8daf27776783	Python Básico - Lección 6	Contenido 6	6	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	ae2533b7-3531-4d1d-9614-3200c838f913
b0331d8d-b9ad-427b-ad85-9016ec8011ab	Python Intermedio - Lección 1	Contenido 1	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	b0afa918-bea5-42f6-9ea4-a5b1824955e7
4a5a7c7b-50ae-45b9-be8c-dda35b9195c8	Python Intermedio - Lección 2	Contenido 2	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	b0afa918-bea5-42f6-9ea4-a5b1824955e7
8326970b-9354-4958-9eeb-9217dc135c26	Python Intermedio - Lección 3	Contenido 3	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	b0afa918-bea5-42f6-9ea4-a5b1824955e7
f564fa23-e30e-4821-962a-16de83162a1c	Python Intermedio - Lección 4	Contenido 4	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	b0afa918-bea5-42f6-9ea4-a5b1824955e7
b0dbb4c2-ef6b-462a-b0bf-7a87ced68b4b	Python Intermedio - Lección 5	Contenido 5	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	b0afa918-bea5-42f6-9ea4-a5b1824955e7
6a442e91-c44e-4dc8-860c-af6f8188f4c4	Python Intermedio - Lección 6	Contenido 6	6	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	b0afa918-bea5-42f6-9ea4-a5b1824955e7
5064edad-6b29-4553-89e8-ab155729c6cc	C# Básico - Lección 1	Contenido 1	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	ecaac183-edb7-4929-827c-c7f4e0a35ff1
ed097a2b-1e91-4d60-9bb3-8a9a550b7a95	C# Básico - Lección 2	Contenido 2	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	ecaac183-edb7-4929-827c-c7f4e0a35ff1
5f8cfb5b-c895-4564-bf20-ed001681c745	C# Básico - Lección 3	Contenido 3	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	ecaac183-edb7-4929-827c-c7f4e0a35ff1
67a70284-5304-4d40-a1a0-aac647850cea	C# Básico - Lección 4	Contenido 4	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	ecaac183-edb7-4929-827c-c7f4e0a35ff1
bf8eadde-b513-4bc0-b733-96bc7310ba5f	C# Básico - Lección 5	Contenido 5	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	ecaac183-edb7-4929-827c-c7f4e0a35ff1
3b24e104-e4ca-4552-89d3-25338870f837	C# Básico - Lección 6	Contenido 6	6	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	ecaac183-edb7-4929-827c-c7f4e0a35ff1
7ed7991a-fe63-479b-a3c3-742509f4a0fc	Java Básico - Lección 1	Contenido 1	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	23e98b42-8a0e-469e-88dd-3a315d613f58
915a272f-aea4-4dbe-85d3-082e0522815d	Java Básico - Lección 2	Contenido 2	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	23e98b42-8a0e-469e-88dd-3a315d613f58
92bc2954-4468-4d1c-ba30-6b641b8deae3	Java Básico - Lección 3	Contenido 3	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	23e98b42-8a0e-469e-88dd-3a315d613f58
b8ea943e-0ab3-4c03-8afa-29e7a2ce6b3f	Java Básico - Lección 4	Contenido 4	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	23e98b42-8a0e-469e-88dd-3a315d613f58
0928894b-d148-4a36-affd-7c55fc7b360e	Java Básico - Lección 5	Contenido 5	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	23e98b42-8a0e-469e-88dd-3a315d613f58
21ac29e0-b15a-4649-baeb-08d95a6d412f	Java Básico - Lección 6	Contenido 6	6	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	23e98b42-8a0e-469e-88dd-3a315d613f58
aff7ca11-8cff-48dc-9b3d-691de68315a0	JavaScript Avanzado - Lección 1	Contenido 1	1	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	0be99309-b44f-4a4c-8cb1-e7c07744414d
2c024d96-379b-4ff4-8651-add80cbffdf5	JavaScript Avanzado - Lección 2	Contenido 2	2	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	0be99309-b44f-4a4c-8cb1-e7c07744414d
3f97a898-6b10-4a74-b618-8f0960399f7b	JavaScript Avanzado - Lección 3	Contenido 3	3	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	0be99309-b44f-4a4c-8cb1-e7c07744414d
37c5e2a6-ddee-46a4-b8ad-5670a9813116	JavaScript Avanzado - Lección 4	Contenido 4	4	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	0be99309-b44f-4a4c-8cb1-e7c07744414d
5344f783-1de6-4a08-86b0-506c5fc6b9b1	JavaScript Avanzado - Lección 5	Contenido 5	5	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	0be99309-b44f-4a4c-8cb1-e7c07744414d
b6db9a9d-b6b7-40f1-92dc-94ca8d689820	JavaScript Avanzado - Lección 6	Contenido 6	6	t	2026-02-13 21:14:02.056301	2026-02-13 21:14:02.056301	0be99309-b44f-4a4c-8cb1-e7c07744414d
\.


--
-- Data for Name: live_coding_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.live_coding_sessions (id, user_id, challenge_id, code, time_taken_seconds, execution_time_ms, score, tab_switches, copy_paste_count, penalties_applied, all_tests_passed, started_at, completed_at) FROM stdin;
530d22f0-08c1-499e-a97c-c46c7edb550d	5086d4a7-519a-4496-9938-ee343f38861f	2302c7ce-3368-41e0-ad8e-c85080ebc8c0	function fibonacci(n) {\n    // Casos base\n    if (n <= 1) {\n        return n;\n    }\n    \n    // Inicializamos los primeros dos números\n    let fibAnterior = 0;  // F(0)\n    let fibActual = 1;    // F(1)\n    \n    // Calculamos F(n) iterativamente\n    for (let i = 2; i <= n; i++) {\n        let fibSiguiente = fibAnterior + fibActual;\n        fibAnterior = fibActual;\n        fibActual = fibSiguiente;\n    }\n    \n    return fibActual;\n}\n\n// Ejemplo de uso\nlet n = 4;\nconsole.log(fibonacci(n)); // Output: 3	13	0.001	85	1	2	65	t	2026-03-19 13:40:19.377131	2026-03-19 09:40:33.248
75940a6a-93a3-4ba9-86ae-e69c12ebc8f7	5086d4a7-519a-4496-9938-ee343f38861f	2302c7ce-3368-41e0-ad8e-c85080ebc8c0	function fibonacci(n) {\n    // Casos base\n    if (n <= 1) {\n        return n;\n    }\n    \n    // Inicializamos los primeros dos números\n    let fibAnterior = 0;  // F(0)\n    let fibActual = 1;    // F(1)\n    \n    // Calculamos F(n) iterativamente\n    for (let i = 2; i <= n; i++) {\n        let fibSiguiente = fibAnterior + fibActual;\n        fibAnterior = fibActual;\n        fibActual = fibSiguiente;\n    }\n    \n    return fibActual;\n}\n\n// Ejemplo de uso\nlet n = 4;\nconsole.log(fibonacci(n)); // Output: 3	45	0.001	84	1	2	65	t	2026-03-19 13:37:51.318055	2026-03-19 09:38:37.561
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
1	1770308950859	InitialSchema1770308950859
2	1770313121085	CreateModulesLessonsExercises1770313121085
3	1770744918863	AuthSchemaUpdate1770744918863
4	1770745186048	AddUpdatedAtToUser1770745186048
5	1771020094017	FixUserProgressUserIdType1771020094017
6	1771020323823	FixUserProgressExerciseIdType1771020323823
7	1771024198000	AddExerciseTests1771024198000
8	1772299197850	AddBestExecutionTime1772299197850
9	1772300741368	RefactorTestsToChallenges1772300741368
10	1772474553468	AddBestExecutionCode1772474553468
12	1741700941000	AddLiveCodingSessions1741700941000
13	1773248520910	RenamePasteCountToCopyPasteCount1773248520910
14	1773859200000	AddUserStreaks1773859200000
15	1773945600000	AddDailyActivity1773945600000
16	1773945700000	AddWeeklyXpAndLeagues1773945700000
17	1773945800000	AddSkillTree1773945800000
\.


--
-- Data for Name: modules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.modules (id, module_number, name, description, icon, "order", is_active, created_at, updated_at) FROM stdin;
65bd187b-73ef-4457-b79a-d7b15ee219c7	1	Variables y Tipos de Datos	Aprende los fundamentos de almacenar información en JavaScript	javaScript	1	t	2026-02-05 18:33:58.048943	2026-02-05 18:33:58.048943
45eec4d1-1a3d-402b-b8fc-c1103db1f7f8	2	Condicionales	Controla el flujo de tu programa con lógica booleana	javaScript	2	t	2026-02-05 18:33:58.070853	2026-02-05 18:33:58.070853
89ed617a-add1-4ca8-adb2-03d3ec8c09db	3	Bucles	Repite acciones y automatiza tareas	javaScript	3	t	2026-02-05 18:33:58.082865	2026-02-05 18:33:58.082865
2d30e9b6-5e59-4889-8f4f-c957269480db	4	Funciones	Crea bloques de código reutilizables	javaScript	4	t	2026-02-05 18:33:58.094112	2026-02-05 18:33:58.094112
ae2533b7-3531-4d1d-9614-3200c838f913	10	Python Básico	Fundamentos Python	python	10	t	2026-02-13 21:14:02.051857	2026-02-13 21:14:02.051857
b0afa918-bea5-42f6-9ea4-a5b1824955e7	11	Python Intermedio	Python medio	python	11	t	2026-02-13 21:14:02.051857	2026-02-13 21:14:02.051857
23e98b42-8a0e-469e-88dd-3a315d613f58	13	Java Básico	Fundamentos Java	java	13	t	2026-02-13 21:14:02.051857	2026-02-13 21:14:02.051857
0be99309-b44f-4a4c-8cb1-e7c07744414d	14	JavaScript Avanzado	JS avanzado	java	14	t	2026-02-13 21:14:02.051857	2026-02-13 21:14:02.051857
ecaac183-edb7-4929-827c-c7f4e0a35ff1	12	C# Básico	Fundamentos C#	csharp	12	t	2026-02-13 21:14:02.051857	2026-02-13 21:14:02.051857
\.


--
-- Data for Name: reactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reactions (id, user_id, challenge_id, type, created_at) FROM stdin;
100f0b01-f337-4a9a-a6c7-5a9b53b27e00	f7b55a67-e41f-4c48-902c-0ea858cd13be	4fff9a3b-d665-485f-bca7-9602e6dbba72	LIKE	2026-01-19 07:57:50.163
e419aaf1-a283-44c0-8f55-06bc10385089	238b9dac-2644-427e-8bd2-ed4c3abb8890	4fff9a3b-d665-485f-bca7-9602e6dbba72	LIKE	2026-01-17 07:57:50.167
dc18e612-37e2-4a41-a9d4-6a35f621463c	71acdd69-48cd-4740-80d8-962b70085449	4fff9a3b-d665-485f-bca7-9602e6dbba72	LIKE	2026-01-01 07:57:50.17
7cafc0b9-11ff-471e-81a4-9a3beb157904	9f8dd3c6-3a70-4541-94a6-a4ea9ce5c5ce	4fff9a3b-d665-485f-bca7-9602e6dbba72	LIKE	2025-12-12 07:57:50.174
1a12fa74-23a6-4c74-b7f7-7a1052b8f09a	484180d6-851b-461b-9995-07d3e3fb0116	4fff9a3b-d665-485f-bca7-9602e6dbba72	LIKE	2025-12-24 07:57:50.178
d4db2983-00c9-4771-9b25-cfc7b0d780e7	917efd28-bbfe-4c3f-bf93-4af3e5c2c31e	4fff9a3b-d665-485f-bca7-9602e6dbba72	LIKE	2025-12-21 07:57:50.182
bdd5715f-77de-4005-979e-3a3c323c45cb	6612a331-2296-4356-9611-a2c836fadf7e	4fff9a3b-d665-485f-bca7-9602e6dbba72	LIKE	2026-01-16 07:57:50.185
3e07591e-e83f-4c5c-af60-7d3646fe2d78	5b8d59f9-35b5-4ec3-aca1-1573faf85f67	4fff9a3b-d665-485f-bca7-9602e6dbba72	LIKE	2026-01-14 07:57:50.187
33d5f628-3a11-43e3-9ac8-a1a36bec63eb	07c79298-6724-4826-934c-0c0693e8f51a	4fff9a3b-d665-485f-bca7-9602e6dbba72	LIKE	2026-01-28 07:57:50.19
c4d43051-4182-4d0e-9a2d-dbbb0aeede9a	b96b833c-b88d-40f6-80df-146bdd457983	4fff9a3b-d665-485f-bca7-9602e6dbba72	LIKE	2026-01-05 07:57:50.193
22521c5f-c84e-493b-a2f2-afc1e7ce2ec2	72939137-da8b-456c-834b-2a9753bbe1ba	4fff9a3b-d665-485f-bca7-9602e6dbba72	LIKE	2025-12-30 07:57:50.196
368cfa99-b7c6-42ed-aa80-c9caf13b6610	f9b29a1f-0ca4-4839-a144-388964c66555	4fff9a3b-d665-485f-bca7-9602e6dbba72	LOVE	2026-01-16 07:57:50.199
5f45d2c9-f521-4580-a836-d6295b6535c8	f3642b14-2e93-44f2-84fc-db0ed83b404f	4fff9a3b-d665-485f-bca7-9602e6dbba72	LIKE	2026-01-20 07:57:50.201
ae31336b-1f9b-4847-b116-4a0181ddd368	312d7038-0402-4693-8c0e-5c7fedf8519f	4fff9a3b-d665-485f-bca7-9602e6dbba72	LIKE	2026-01-05 07:57:50.204
3a006d74-79aa-463d-9290-72b64b8e3eb2	5a41b008-7743-477d-b69a-f24cd12d0ef8	82a49837-ef24-401f-89df-09a4e2ec1252	LIKE	2025-12-29 07:57:50.219
c2b67ca6-2c8b-4c19-aae8-b5b0a4c983e7	b2e33f04-354c-4b61-9db1-72d4cb2bf07c	82a49837-ef24-401f-89df-09a4e2ec1252	LIKE	2026-01-18 07:57:50.222
03775e2c-3166-4321-a4b5-f74b659154f1	b6afb299-43be-4bc6-86ee-434584f5f0a2	82a49837-ef24-401f-89df-09a4e2ec1252	LIKE	2026-01-15 07:57:50.225
5ccf08d6-3184-4b2a-b3bf-73f03542f8d1	ae59a5c3-cd8a-4a6d-8481-e7a56bc62151	82a49837-ef24-401f-89df-09a4e2ec1252	LIKE	2025-12-21 07:57:50.227
0c72ad8b-37ad-4a83-8980-ba0d5e3e718c	79909d3c-4b0e-4a92-88fd-41b147c0ff27	82a49837-ef24-401f-89df-09a4e2ec1252	LOVE	2025-12-08 07:57:50.23
d4259ec8-fd4d-4a05-b159-391efeb752e3	d279d4a9-1412-4a74-a40b-44954082a13c	82a49837-ef24-401f-89df-09a4e2ec1252	LOVE	2025-12-11 07:57:50.233
220acec4-1b71-4b66-8d2c-f664d1e20239	bcf553c4-58ee-410f-a74d-d5d9370b0dde	82a49837-ef24-401f-89df-09a4e2ec1252	LIKE	2025-12-13 07:57:50.235
64f9294a-1c7e-4197-8cdc-67c32f46942c	dcbd21e4-2164-4f08-b560-e3e06c906b12	82a49837-ef24-401f-89df-09a4e2ec1252	LIKE	2026-01-18 07:57:50.239
efcec95c-029c-4fb3-b847-3c881a541f2e	4122c870-8a2d-4191-a4aa-fbf19fdaac1a	82a49837-ef24-401f-89df-09a4e2ec1252	LOVE	2026-01-08 07:57:50.241
a18658d7-abe3-43ca-950c-e1a1566d4ed9	07c79298-6724-4826-934c-0c0693e8f51a	82a49837-ef24-401f-89df-09a4e2ec1252	LIKE	2026-01-11 07:57:50.244
164434db-d6f9-410d-ad5f-32a65ded5799	2f1ccf7a-022a-4f35-befc-7b401c50aa38	82a49837-ef24-401f-89df-09a4e2ec1252	LIKE	2025-12-30 07:57:50.248
c07ff4d2-8282-4a7f-a63b-b69bc4ffd64f	4b1c2adf-90d0-48e2-a40e-3950a4ce2a83	82a49837-ef24-401f-89df-09a4e2ec1252	LIKE	2025-12-02 07:57:50.252
28f655e7-34cd-43df-9bbf-eb2614d9d780	3909ff1e-c321-480c-95e1-0176ffe923bb	82a49837-ef24-401f-89df-09a4e2ec1252	LIKE	2026-01-28 07:57:50.256
64adf894-827d-49ac-9926-e9a87b357e84	62c61c87-6e44-4d1e-b891-5a637c989a03	82a49837-ef24-401f-89df-09a4e2ec1252	LIKE	2025-12-22 07:57:50.261
05ca42ff-6115-4fc8-ba24-b4c0459dcc3a	8a1e0004-0a71-42b7-89ef-71bad6479a9e	82a49837-ef24-401f-89df-09a4e2ec1252	LIKE	2026-01-04 07:57:50.265
99a0caaf-599e-457a-9ecc-60eb53f117e8	b96b833c-b88d-40f6-80df-146bdd457983	82a49837-ef24-401f-89df-09a4e2ec1252	LIKE	2026-01-21 07:57:50.268
e33d05cc-8923-4290-960f-34142b1e55c5	5b8d59f9-35b5-4ec3-aca1-1573faf85f67	82a49837-ef24-401f-89df-09a4e2ec1252	LIKE	2026-01-04 07:57:50.27
131bda88-68dd-44bf-b1ca-ec98bd2981bb	d0deb68d-283f-465f-9c10-211a4742a34e	82a49837-ef24-401f-89df-09a4e2ec1252	LIKE	2026-01-19 07:57:50.273
949cd2c9-090d-4dd5-822a-5abaef9eded4	ec253d46-469a-4ab5-baa1-16ca991871c5	1d6a9778-14e1-466f-8ef3-877dde7b5315	LIKE	2025-12-17 07:57:50.277
c8b4b674-7cfa-4d10-b2c2-eb64023dd3d9	71acdd69-48cd-4740-80d8-962b70085449	1d6a9778-14e1-466f-8ef3-877dde7b5315	LIKE	2025-12-22 07:57:50.28
a444f902-c0d5-4478-8ffe-61ee7bd42817	939a0a06-1e1a-4cb8-a6b3-6737f38d264b	1d6a9778-14e1-466f-8ef3-877dde7b5315	LIKE	2026-01-02 07:57:50.282
ef6e39e1-63e3-47a1-aec5-4486007e59e0	444cd236-b686-4c61-87c9-2a9e87933d7b	1d6a9778-14e1-466f-8ef3-877dde7b5315	LIKE	2025-12-29 07:57:50.285
a51101ed-3120-4a77-b035-bd4f38ce15ae	f72c60c1-cba6-4b45-b182-49b3b4a3e651	1d6a9778-14e1-466f-8ef3-877dde7b5315	LIKE	2025-12-06 07:57:50.288
7a17fe09-dfc3-48aa-abcf-e9e47538f286	03022b17-5967-486d-818e-85a2b71056d5	1d6a9778-14e1-466f-8ef3-877dde7b5315	LIKE	2026-01-08 07:57:50.291
64fad694-beca-4650-84fb-e614a1eb5322	484180d6-851b-461b-9995-07d3e3fb0116	1d6a9778-14e1-466f-8ef3-877dde7b5315	LIKE	2026-01-15 07:57:50.295
40d55e19-5436-4295-9536-0fe61fbfc2bf	15aec74c-1343-4c15-a58d-887b6a06b1f3	1d6a9778-14e1-466f-8ef3-877dde7b5315	LIKE	2025-12-08 07:57:50.298
8273e176-6a68-4023-b203-8fad8230fa68	67475aa3-0f09-47e2-8f7a-4e7fa35a94fb	1d6a9778-14e1-466f-8ef3-877dde7b5315	LIKE	2025-12-18 07:57:50.301
b9c9bdb0-3d17-442e-816f-3258b6792eb3	b2e33f04-354c-4b61-9db1-72d4cb2bf07c	1d6a9778-14e1-466f-8ef3-877dde7b5315	LIKE	2025-12-11 07:57:50.304
7d951aed-da05-47e3-ab0b-6ae15131bf04	deaa1ab2-4d52-4cb4-a36b-fcc583b99992	1d6a9778-14e1-466f-8ef3-877dde7b5315	LIKE	2025-12-15 07:57:50.306
56764235-0ca0-40df-88df-7c9cd2c53152	0587db93-4151-4825-8cbf-d96e5893212b	1d6a9778-14e1-466f-8ef3-877dde7b5315	LOVE	2025-12-11 07:57:50.308
c4982d12-bcbc-4d14-b524-be0b2dc8adac	72939137-da8b-456c-834b-2a9753bbe1ba	cd66d563-720c-435c-b430-c3081763b89b	LIKE	2026-01-22 07:57:50.31
7494d576-a191-4f87-aa71-377d26ec8390	55ba721f-044e-4dd1-94a5-3de7dedd3bae	cd66d563-720c-435c-b430-c3081763b89b	LOVE	2026-01-26 07:57:50.313
bb1fb135-3a27-4e5b-8a47-1c474bdea6d4	67475aa3-0f09-47e2-8f7a-4e7fa35a94fb	cd66d563-720c-435c-b430-c3081763b89b	LIKE	2026-01-04 07:57:50.316
58d1f84e-c8b2-4243-a401-0b5330981a5a	b96b833c-b88d-40f6-80df-146bdd457983	cd66d563-720c-435c-b430-c3081763b89b	LIKE	2026-01-22 07:57:50.318
7a4e2154-da8f-4a67-9fe3-eba89ee27da3	8a1e0004-0a71-42b7-89ef-71bad6479a9e	cd66d563-720c-435c-b430-c3081763b89b	LIKE	2026-01-26 07:57:50.32
fe2d22eb-880a-4e03-9a55-7acfc2a0f4f6	8c63e328-754f-41b3-96b2-febcc8db78f1	cd66d563-720c-435c-b430-c3081763b89b	LIKE	2026-01-22 07:57:50.323
6bbd3015-21b5-4d3f-bff7-f411ee48e395	ae59a5c3-cd8a-4a6d-8481-e7a56bc62151	cd66d563-720c-435c-b430-c3081763b89b	LIKE	2025-12-26 07:57:50.325
402262af-9a52-4882-b55b-29e6b2b6fb5e	090ee80d-5929-4486-945c-104600e2b757	cd66d563-720c-435c-b430-c3081763b89b	LIKE	2025-12-13 07:57:50.328
2aa95e64-ef14-47ba-bd1b-a1e6e35b60a6	84fa5ae9-2b10-4102-83b0-391accda9aba	cd66d563-720c-435c-b430-c3081763b89b	LIKE	2026-01-26 07:57:50.33
8298016c-b590-4be7-8973-5fdc15622f12	e7c55ea4-ee93-4b5a-8410-e27c6e65483b	cd66d563-720c-435c-b430-c3081763b89b	LIKE	2026-01-26 07:57:50.333
b624dfac-e92f-4d3a-a44f-d512d80a0978	cf7c11a7-a38d-4241-81ff-180548d5f270	cd66d563-720c-435c-b430-c3081763b89b	LOVE	2025-12-22 07:57:50.336
21f2ef6b-eb79-472e-af38-5407c40e7839	40540771-bd01-477e-9bd9-1a97e9791fd1	cd66d563-720c-435c-b430-c3081763b89b	LIKE	2025-12-22 07:57:50.338
dc9c81d9-8381-4e01-afea-c4123729a503	484180d6-851b-461b-9995-07d3e3fb0116	cd66d563-720c-435c-b430-c3081763b89b	LIKE	2025-12-31 07:57:50.34
31aaba9a-45cc-4088-a650-816bc9b29efb	f3642b14-2e93-44f2-84fc-db0ed83b404f	cd66d563-720c-435c-b430-c3081763b89b	LIKE	2025-12-25 07:57:50.343
6148eb19-b49e-4d8b-8fd4-e990f4ea9f25	bcf553c4-58ee-410f-a74d-d5d9370b0dde	28f8bd5a-8d37-4d05-b074-9d8574dec020	LIKE	2026-01-18 08:00:26.275
a5d22068-0b0b-4917-9542-0f9df03c5b22	f2d3c142-53b9-4641-9682-90b34edd5154	28f8bd5a-8d37-4d05-b074-9d8574dec020	LIKE	2026-01-13 08:00:26.278
a34b092b-9f5e-417a-8cfe-cba7e7c4d218	8a1e0004-0a71-42b7-89ef-71bad6479a9e	28f8bd5a-8d37-4d05-b074-9d8574dec020	LIKE	2025-12-28 08:00:26.282
51667689-47cc-47e4-8036-235540a1b6ea	deaa1ab2-4d52-4cb4-a36b-fcc583b99992	28f8bd5a-8d37-4d05-b074-9d8574dec020	LIKE	2026-01-04 08:00:26.284
9046887e-215b-4961-9338-0aa47ccf097a	e83739b5-9a5b-43a0-853a-f02ef6abc694	28f8bd5a-8d37-4d05-b074-9d8574dec020	LIKE	2025-12-04 08:00:26.287
89608c8c-0995-4b74-bf64-b21bec43f8e9	5120f1c6-507e-4a5b-aa9f-53241f3a2b9b	28f8bd5a-8d37-4d05-b074-9d8574dec020	LOVE	2025-12-06 08:00:26.29
cc67c1ba-9973-4904-8ec5-fb82008ab3a7	1ad14a3d-0f96-411e-a103-a0ec4dafe480	28f8bd5a-8d37-4d05-b074-9d8574dec020	LIKE	2026-01-14 08:00:26.293
abc33df6-026e-4c31-b9ad-40659096772b	f7b55a67-e41f-4c48-902c-0ea858cd13be	28f8bd5a-8d37-4d05-b074-9d8574dec020	LIKE	2026-01-17 08:00:26.296
4ad57065-8d24-405d-8292-467d68288336	4338aa7b-9826-4c1f-8cf5-7d0a5331d4a2	28f8bd5a-8d37-4d05-b074-9d8574dec020	LIKE	2025-12-26 08:00:26.3
e0b0ac98-657c-4bab-939d-13f677712131	b6afb299-43be-4bc6-86ee-434584f5f0a2	28f8bd5a-8d37-4d05-b074-9d8574dec020	LIKE	2025-12-11 08:00:26.303
8505fb88-439f-4daf-a8f9-bfed970ff661	eb7f7b5a-e424-4faa-87ba-ff4d35c81cc4	28f8bd5a-8d37-4d05-b074-9d8574dec020	LOVE	2026-01-23 08:00:26.306
a3ae18b5-2c34-435b-9a9a-c668ace304a1	55ba721f-044e-4dd1-94a5-3de7dedd3bae	28f8bd5a-8d37-4d05-b074-9d8574dec020	LOVE	2025-12-24 08:00:26.31
7f065b1f-43b3-41b8-bd38-3fc86caf6c98	6e69e1f1-2d77-49da-bc84-62f12a401fdb	28f8bd5a-8d37-4d05-b074-9d8574dec020	LIKE	2026-01-10 08:00:26.312
621403bf-8603-4656-bfa2-c3824d7d851a	b96b833c-b88d-40f6-80df-146bdd457983	28f8bd5a-8d37-4d05-b074-9d8574dec020	LIKE	2025-12-22 08:00:26.315
b5284594-f96e-4d07-8a76-d5d5f7d28f3a	62c61c87-6e44-4d1e-b891-5a637c989a03	28f8bd5a-8d37-4d05-b074-9d8574dec020	LIKE	2025-12-05 08:00:26.317
9a0cb239-18ae-4bb5-b4f2-07aa2266a333	184e24f5-5cb4-4cc0-b562-addee57f91cc	28f8bd5a-8d37-4d05-b074-9d8574dec020	LIKE	2025-12-16 08:00:26.319
5d074070-920c-4fc7-81e4-636926376fb2	b2e33f04-354c-4b61-9db1-72d4cb2bf07c	28f8bd5a-8d37-4d05-b074-9d8574dec020	LIKE	2025-12-03 08:00:26.324
4afd1a04-2927-440f-b706-eed526037cc7	07c79298-6724-4826-934c-0c0693e8f51a	28f8bd5a-8d37-4d05-b074-9d8574dec020	LIKE	2025-12-16 08:00:26.326
25540e2b-a3ac-4da0-a33c-3ed386569437	40540771-bd01-477e-9bd9-1a97e9791fd1	28f8bd5a-8d37-4d05-b074-9d8574dec020	LIKE	2026-01-22 08:00:26.328
631be3a1-88db-4bc7-8a09-50d3f62b943a	939a0a06-1e1a-4cb8-a6b3-6737f38d264b	28f8bd5a-8d37-4d05-b074-9d8574dec020	LIKE	2026-01-01 08:00:26.331
779fd601-a6bb-41a3-aac0-989dfc331b85	1475b0c5-e395-42d2-ba08-03b68d7a233c	af219683-7e15-4fd7-a86d-5de6cb0ff7f8	LIKE	2026-01-21 08:00:26.335
1d668b49-ebfb-4689-a00f-8823a526902c	eb7f7b5a-e424-4faa-87ba-ff4d35c81cc4	af219683-7e15-4fd7-a86d-5de6cb0ff7f8	LIKE	2026-01-24 08:00:26.338
9e343467-3e36-4213-b562-394f2e5090c8	71acdd69-48cd-4740-80d8-962b70085449	af219683-7e15-4fd7-a86d-5de6cb0ff7f8	LIKE	2026-01-12 08:00:26.341
87ce0be5-75cb-43be-9a4a-fb80e7f0f087	f72c60c1-cba6-4b45-b182-49b3b4a3e651	af219683-7e15-4fd7-a86d-5de6cb0ff7f8	LIKE	2025-12-07 08:00:26.344
02b05d64-dcba-4389-b9e7-f217f2a2ccfc	84fa5ae9-2b10-4102-83b0-391accda9aba	af219683-7e15-4fd7-a86d-5de6cb0ff7f8	LIKE	2026-01-22 08:00:26.347
5cd9ae7d-a835-4a56-98e7-42db95f35a0c	0566f71b-c470-4fd6-9223-79ec9b266a9b	af219683-7e15-4fd7-a86d-5de6cb0ff7f8	LIKE	2026-01-17 08:00:26.35
56a657cb-9c98-42cd-b641-0b358be39069	27a7b508-cfef-4e86-a91c-1cbb6ef7d556	af219683-7e15-4fd7-a86d-5de6cb0ff7f8	LIKE	2025-12-12 08:00:26.353
d11c9a7f-4c48-445b-9938-2eb928313b9a	5a41b008-7743-477d-b69a-f24cd12d0ef8	af219683-7e15-4fd7-a86d-5de6cb0ff7f8	LIKE	2026-01-23 08:00:26.356
9ec51723-0216-4b8d-8cae-879f938776ac	cf7c11a7-a38d-4241-81ff-180548d5f270	af219683-7e15-4fd7-a86d-5de6cb0ff7f8	LIKE	2026-01-28 08:00:26.358
6b0f6799-5f68-4468-96c2-3034aeb267a5	b38028d8-8c4a-4c0d-8759-a79b6ed93fc1	af219683-7e15-4fd7-a86d-5de6cb0ff7f8	LIKE	2025-12-23 08:00:26.36
6b996a70-30af-492e-b4a5-0b1f896ed316	dcbd21e4-2164-4f08-b560-e3e06c906b12	af219683-7e15-4fd7-a86d-5de6cb0ff7f8	LIKE	2026-01-20 08:00:26.363
2f5e8cd8-20d0-4a87-baa4-d7174911fe32	484180d6-851b-461b-9995-07d3e3fb0116	af219683-7e15-4fd7-a86d-5de6cb0ff7f8	LIKE	2025-12-18 08:00:26.366
f33c3fdf-9cda-45d5-a55f-8645a8ff4f51	2f1ccf7a-022a-4f35-befc-7b401c50aa38	af219683-7e15-4fd7-a86d-5de6cb0ff7f8	LIKE	2026-01-16 08:00:26.37
f85a6eba-2359-4137-bc7c-15f8374a3309	9f8dd3c6-3a70-4541-94a6-a4ea9ce5c5ce	af219683-7e15-4fd7-a86d-5de6cb0ff7f8	LIKE	2025-12-08 08:00:26.373
317c6e48-a619-4df7-8d17-6a0bc02ebf0e	5a8e03d7-2b9b-4330-b28a-a64d9ea31629	af219683-7e15-4fd7-a86d-5de6cb0ff7f8	LIKE	2026-01-16 08:00:26.376
ebb473f3-8bab-487f-b7a2-d9b1ed27ee77	38c839cc-f81a-4998-8afa-aaf4ba466248	af219683-7e15-4fd7-a86d-5de6cb0ff7f8	LIKE	2026-01-27 08:00:26.381
c0aa839c-2f62-4a6c-a72a-9ff878fbf891	d0deb68d-283f-465f-9c10-211a4742a34e	11d05ad1-7007-45f7-90d2-99f2374d6c6b	LIKE	2026-01-07 08:00:26.385
5fb352c2-d8f0-4cca-8ed5-5ba8643d41c4	ea32ea39-a33f-49cc-af13-04804ae4dfa0	11d05ad1-7007-45f7-90d2-99f2374d6c6b	LIKE	2025-12-12 08:00:26.387
342d7936-e08e-4f2b-9412-cdd5410befd4	15aec74c-1343-4c15-a58d-887b6a06b1f3	11d05ad1-7007-45f7-90d2-99f2374d6c6b	LIKE	2025-12-24 08:00:26.391
84eeec21-53b9-4494-8bee-8cb93093f92e	7bbf08be-8791-4b49-9452-3200a0b22b87	11d05ad1-7007-45f7-90d2-99f2374d6c6b	LIKE	2025-12-03 08:00:26.394
e6589f72-9fdc-4934-8d5a-8a6f271c22fa	f3642b14-2e93-44f2-84fc-db0ed83b404f	11d05ad1-7007-45f7-90d2-99f2374d6c6b	LIKE	2026-01-29 08:00:26.398
a4d99f25-2db3-4804-9592-e257562d2ba0	ba870ced-b54a-42e1-93bf-9bf0df99d544	11d05ad1-7007-45f7-90d2-99f2374d6c6b	LIKE	2025-12-27 08:00:26.4
60b59657-9eec-4b65-824f-c414b04900a9	92472c64-e07d-4692-b1a5-618eec89121a	11d05ad1-7007-45f7-90d2-99f2374d6c6b	LIKE	2025-12-16 08:00:26.402
7f1ad58a-b5a5-4b24-ac07-4de72ff95d2c	50b2fd75-14de-406c-9db1-e61588b96068	11d05ad1-7007-45f7-90d2-99f2374d6c6b	LOVE	2025-12-28 08:00:26.405
7dc95b94-f673-4a21-94c5-a4de1e24e3d5	72939137-da8b-456c-834b-2a9753bbe1ba	11d05ad1-7007-45f7-90d2-99f2374d6c6b	LIKE	2025-12-09 08:00:26.408
3c6518f1-3f7a-4cda-9648-611b901269a6	66e331b4-7b4b-42a6-b0be-532332292f1b	11d05ad1-7007-45f7-90d2-99f2374d6c6b	LIKE	2025-12-04 08:00:26.41
dca47523-5794-4559-b6d7-3f25f43bf6c0	444cd236-b686-4c61-87c9-2a9e87933d7b	11d05ad1-7007-45f7-90d2-99f2374d6c6b	LOVE	2026-01-23 08:00:26.413
c3b2422e-798d-43c0-9146-b87ecbdf27b6	f7b55a67-e41f-4c48-902c-0ea858cd13be	11d05ad1-7007-45f7-90d2-99f2374d6c6b	LIKE	2025-12-22 08:00:26.415
0141e00d-3411-4f42-b92d-199e2fe69036	cf7c11a7-a38d-4241-81ff-180548d5f270	11d05ad1-7007-45f7-90d2-99f2374d6c6b	LOVE	2025-12-26 08:00:26.419
bbbc64ed-eef0-47cd-9f27-354b4327d757	91fb42f5-a87c-4ec0-97bd-2ca1fc3eff88	11d05ad1-7007-45f7-90d2-99f2374d6c6b	LIKE	2025-12-07 08:00:26.421
1d8f6b85-d11a-4280-8b71-63025d4afceb	90166457-241e-46a6-bd4b-1a19d8bfe12a	11d05ad1-7007-45f7-90d2-99f2374d6c6b	LIKE	2025-12-03 08:00:26.423
5f52b9b2-ce60-4172-b160-8724d74d00f0	2f1ccf7a-022a-4f35-befc-7b401c50aa38	11d05ad1-7007-45f7-90d2-99f2374d6c6b	LIKE	2026-01-25 08:00:26.425
ea3cf53d-55d9-41fe-813e-5986870ff1fb	6f2a0c6d-6e90-4cd6-8774-abd9c722c6b4	11d05ad1-7007-45f7-90d2-99f2374d6c6b	LIKE	2026-01-25 08:00:26.427
e2456151-fc26-40ba-9a48-93b9b0041a53	15aec74c-1343-4c15-a58d-887b6a06b1f3	81dcdb79-168e-48d2-9858-2db371184f88	LIKE	2026-01-08 08:00:26.429
6cd00366-b657-4d57-8400-9e8306ff3169	f175b7f6-7867-45ed-ab09-0fe265040bcf	81dcdb79-168e-48d2-9858-2db371184f88	LIKE	2026-01-08 08:00:26.431
4d12cf72-c586-45ca-9cc2-8c4b999d71af	184e24f5-5cb4-4cc0-b562-addee57f91cc	81dcdb79-168e-48d2-9858-2db371184f88	LIKE	2025-12-27 08:00:26.434
64ab5cb3-eb86-4e5b-a179-254daf84c635	cdfff534-6c77-4db1-a2f2-faa601ad48eb	81dcdb79-168e-48d2-9858-2db371184f88	LIKE	2025-12-05 08:00:26.436
ef02aed9-f14f-4ae9-a778-d086013e2904	484180d6-851b-461b-9995-07d3e3fb0116	81dcdb79-168e-48d2-9858-2db371184f88	LIKE	2025-12-14 08:00:26.438
cbcc4585-9370-47d4-9b5d-518d3eea089e	40540771-bd01-477e-9bd9-1a97e9791fd1	81dcdb79-168e-48d2-9858-2db371184f88	LOVE	2026-01-23 08:00:26.442
f6f4c9d0-e9b1-4da3-84a5-0c4453f2f6a3	cf7c11a7-a38d-4241-81ff-180548d5f270	81dcdb79-168e-48d2-9858-2db371184f88	LIKE	2026-01-22 08:00:26.444
a9bb05fd-dd9e-40c8-a89e-d5b4b99e0ce3	4b1c2adf-90d0-48e2-a40e-3950a4ce2a83	81dcdb79-168e-48d2-9858-2db371184f88	LIKE	2026-01-17 08:00:26.447
feb2da2d-c11e-4f3a-a43c-55da43ed07f6	eb7f7b5a-e424-4faa-87ba-ff4d35c81cc4	638c6da7-f515-4b48-9969-b8ee5b3fbb3a	LIKE	2026-01-07 08:00:26.45
2c204835-fcfc-4720-ad00-9828367de255	90166457-241e-46a6-bd4b-1a19d8bfe12a	638c6da7-f515-4b48-9969-b8ee5b3fbb3a	LIKE	2025-12-11 08:00:26.454
d7c6476a-5634-4ea5-b741-56c622da84cc	ea32ea39-a33f-49cc-af13-04804ae4dfa0	638c6da7-f515-4b48-9969-b8ee5b3fbb3a	LIKE	2025-12-20 08:00:26.457
a6021760-64f7-4522-9a72-f2e4197267d5	3909ff1e-c321-480c-95e1-0176ffe923bb	638c6da7-f515-4b48-9969-b8ee5b3fbb3a	LIKE	2025-12-02 08:00:26.46
e8f0e4ee-6ec0-4f08-96b5-9771279f32b0	33d891e5-c4e9-4caa-bd27-f66e6cfb37a3	638c6da7-f515-4b48-9969-b8ee5b3fbb3a	LIKE	2025-12-04 08:00:26.462
639acec3-3545-4732-afba-5ef9b94b2c6b	84fa5ae9-2b10-4102-83b0-391accda9aba	638c6da7-f515-4b48-9969-b8ee5b3fbb3a	LIKE	2025-12-04 08:00:26.464
73908033-f504-44e5-b54f-9c94cd03457c	5120f1c6-507e-4a5b-aa9f-53241f3a2b9b	638c6da7-f515-4b48-9969-b8ee5b3fbb3a	LIKE	2025-12-04 08:00:26.467
925c2d0c-0bf5-428d-a4da-c5117b46b6c6	d279d4a9-1412-4a74-a40b-44954082a13c	638c6da7-f515-4b48-9969-b8ee5b3fbb3a	LIKE	2025-12-24 08:00:26.469
cc7b4e3d-65f6-48e0-8f84-908b36e280a0	b6afb299-43be-4bc6-86ee-434584f5f0a2	638c6da7-f515-4b48-9969-b8ee5b3fbb3a	LIKE	2025-12-31 08:00:26.471
2c021e53-76ce-4bfe-8533-ea9c8f40a545	deaa1ab2-4d52-4cb4-a36b-fcc583b99992	638c6da7-f515-4b48-9969-b8ee5b3fbb3a	LIKE	2025-12-06 08:00:26.474
0c334dde-9d17-4a02-8210-0a5c6cb7fabc	e83739b5-9a5b-43a0-853a-f02ef6abc694	638c6da7-f515-4b48-9969-b8ee5b3fbb3a	LOVE	2025-12-30 08:00:26.477
6ab693b8-4572-428e-9b08-b33ceacb4a6b	0566f71b-c470-4fd6-9223-79ec9b266a9b	638c6da7-f515-4b48-9969-b8ee5b3fbb3a	LIKE	2026-01-03 08:00:26.479
25bf57c9-899d-449b-8281-35861ddedc18	07c79298-6724-4826-934c-0c0693e8f51a	638c6da7-f515-4b48-9969-b8ee5b3fbb3a	LIKE	2025-12-13 08:00:26.483
93fdc5b6-0496-49be-ac5c-8f9d080d7fba	50b2fd75-14de-406c-9db1-e61588b96068	638c6da7-f515-4b48-9969-b8ee5b3fbb3a	LIKE	2026-01-24 08:00:26.485
fb3e8463-eafa-4e29-b914-785255ec103b	ae59a5c3-cd8a-4a6d-8481-e7a56bc62151	66d018e5-fee2-4248-beca-34b81d6dbac8	LIKE	2025-12-29 08:00:26.487
b2500308-2821-402b-a57e-064df92004ee	99c9a347-c807-45d1-ae17-1b98989b11d5	66d018e5-fee2-4248-beca-34b81d6dbac8	LIKE	2025-12-10 08:00:26.49
acd9c91a-ecb2-441e-9393-35b96396c50e	03022b17-5967-486d-818e-85a2b71056d5	66d018e5-fee2-4248-beca-34b81d6dbac8	LIKE	2025-12-20 08:00:26.493
a78c99e2-39e7-477a-9b35-37cdf110795a	67475aa3-0f09-47e2-8f7a-4e7fa35a94fb	66d018e5-fee2-4248-beca-34b81d6dbac8	LIKE	2026-01-22 08:00:26.497
ba58e903-fedc-4b2e-a791-a2ddf7f943ce	72939137-da8b-456c-834b-2a9753bbe1ba	66d018e5-fee2-4248-beca-34b81d6dbac8	LIKE	2025-12-07 08:00:26.499
e0e86b16-cc87-47e5-9e2d-459de281d680	dcbd21e4-2164-4f08-b560-e3e06c906b12	66d018e5-fee2-4248-beca-34b81d6dbac8	LIKE	2025-12-03 08:00:26.502
c95360a9-9bc7-4718-86b9-03a1de408266	2f8e040e-fdce-4d63-908b-7d290e6c7ed1	66d018e5-fee2-4248-beca-34b81d6dbac8	LIKE	2026-01-10 08:00:26.504
c52d3467-aca1-41be-b297-370debbc5518	5cb29817-5c04-48e7-9559-4cfb26318863	66d018e5-fee2-4248-beca-34b81d6dbac8	LIKE	2026-01-28 08:00:26.506
8308e292-f714-42e0-8c01-881c6fac1817	b96b833c-b88d-40f6-80df-146bdd457983	66d018e5-fee2-4248-beca-34b81d6dbac8	LIKE	2026-01-08 08:00:26.508
fc64e4b9-90fa-45b1-9162-2ee8411424ee	f3642b14-2e93-44f2-84fc-db0ed83b404f	66d018e5-fee2-4248-beca-34b81d6dbac8	LIKE	2025-12-24 08:00:26.511
44f2d9f4-2b08-4350-bedb-428e18336809	2f1ccf7a-022a-4f35-befc-7b401c50aa38	66d018e5-fee2-4248-beca-34b81d6dbac8	LIKE	2026-01-08 08:00:26.513
e51c5a42-a801-4941-bda7-84c20f1c9970	184e24f5-5cb4-4cc0-b562-addee57f91cc	66d018e5-fee2-4248-beca-34b81d6dbac8	LOVE	2025-12-27 08:00:26.517
39631540-1c4e-49a8-b407-2636a2bda9a2	f175b7f6-7867-45ed-ab09-0fe265040bcf	66d018e5-fee2-4248-beca-34b81d6dbac8	LIKE	2025-12-20 08:00:26.519
f52dcfe5-1825-4898-bd72-ef04b4681c2c	7bbf08be-8791-4b49-9452-3200a0b22b87	66d018e5-fee2-4248-beca-34b81d6dbac8	LIKE	2025-12-31 08:00:26.52
37555d56-34af-4475-b144-41af0e01bc61	07c79298-6724-4826-934c-0c0693e8f51a	05f2c696-e127-46b6-b50e-e25fb9dcbbff	LIKE	2026-01-12 08:00:26.523
4447f863-0de8-4103-93c5-c41b30f18850	38c839cc-f81a-4998-8afa-aaf4ba466248	05f2c696-e127-46b6-b50e-e25fb9dcbbff	LIKE	2025-12-08 08:00:26.525
18ca105f-2ec8-4574-9d9f-22f618825dfe	8a1e0004-0a71-42b7-89ef-71bad6479a9e	05f2c696-e127-46b6-b50e-e25fb9dcbbff	LIKE	2026-01-28 08:00:26.526
791de25d-7c93-45cf-a6b9-0b61fd6a0998	b6afb299-43be-4bc6-86ee-434584f5f0a2	05f2c696-e127-46b6-b50e-e25fb9dcbbff	LIKE	2025-12-23 08:00:26.528
32a6f8f0-9d15-4f2a-8c09-65beb63facc3	72939137-da8b-456c-834b-2a9753bbe1ba	05f2c696-e127-46b6-b50e-e25fb9dcbbff	LIKE	2026-01-28 08:00:26.53
dbe06213-c66c-4412-97a8-76fd8d69bba8	e9239df4-f49b-4f39-b349-252180ecf387	05f2c696-e127-46b6-b50e-e25fb9dcbbff	LIKE	2026-01-05 08:00:26.532
3fd0a10a-7e3a-45cc-9a2a-8aabdf079166	33d891e5-c4e9-4caa-bd27-f66e6cfb37a3	05f2c696-e127-46b6-b50e-e25fb9dcbbff	LIKE	2026-01-03 08:00:26.533
23f05fcc-7efb-4b5a-9d52-9a7b5bc701e3	99c9a347-c807-45d1-ae17-1b98989b11d5	05f2c696-e127-46b6-b50e-e25fb9dcbbff	LIKE	2025-12-09 08:00:26.536
74851d0a-dabb-4142-b68e-3fe84afd81dc	cf7c11a7-a38d-4241-81ff-180548d5f270	05f2c696-e127-46b6-b50e-e25fb9dcbbff	LIKE	2025-12-20 08:00:26.538
9354c0c4-fbbc-453d-ae0e-aa83d754c89c	a7b7f687-3168-4b5b-b01c-acfef742da8a	05f2c696-e127-46b6-b50e-e25fb9dcbbff	LIKE	2026-01-09 08:00:26.539
6833fe44-395e-4a8d-9e73-0c301da40298	03022b17-5967-486d-818e-85a2b71056d5	05f2c696-e127-46b6-b50e-e25fb9dcbbff	LIKE	2025-12-29 08:00:26.541
eb7e0a23-5fb8-4340-b1f2-f96553fa2dc9	eb7f7b5a-e424-4faa-87ba-ff4d35c81cc4	05f2c696-e127-46b6-b50e-e25fb9dcbbff	LIKE	2026-01-22 08:00:26.543
c95ce234-1d2b-48c4-a3ae-13b7fecced2a	f2833746-a709-416f-b755-7efdf87e3ac5	e48b7414-9510-4054-bfec-222e0eb1c0b5	LIKE	2025-12-03 08:00:26.545
851410c2-f3d8-48e7-9e8a-f6ae1645db77	bcf553c4-58ee-410f-a74d-d5d9370b0dde	e48b7414-9510-4054-bfec-222e0eb1c0b5	LIKE	2025-12-22 08:00:26.547
54f2d111-f85a-45b3-a2ca-53e08d4722fd	f175b7f6-7867-45ed-ab09-0fe265040bcf	e48b7414-9510-4054-bfec-222e0eb1c0b5	LIKE	2025-12-14 08:00:26.548
815c15f7-e3c5-42d9-b7cb-9b8711601611	f2d3c142-53b9-4641-9682-90b34edd5154	e48b7414-9510-4054-bfec-222e0eb1c0b5	LIKE	2026-01-01 08:00:26.55
20c87c24-10fa-4f2e-9f53-c7b2c3ba9e39	5a41b008-7743-477d-b69a-f24cd12d0ef8	e48b7414-9510-4054-bfec-222e0eb1c0b5	LIKE	2026-01-18 08:00:26.552
d0c82d0e-8d58-4e94-bee2-eed5bf124d9b	6612a331-2296-4356-9611-a2c836fadf7e	e48b7414-9510-4054-bfec-222e0eb1c0b5	LIKE	2025-12-03 08:00:26.553
443d6d6b-66c0-474f-9b99-c0d40368f5d4	eb7f7b5a-e424-4faa-87ba-ff4d35c81cc4	e48b7414-9510-4054-bfec-222e0eb1c0b5	LIKE	2026-01-20 08:00:26.555
b7c47ef9-38e0-475a-b28b-160dd4d709f2	b6afb299-43be-4bc6-86ee-434584f5f0a2	bcc9d481-9851-423c-9b59-5769c5a810a6	LOVE	2025-12-11 08:00:26.558
2fb9b606-a78a-4ad0-a9c9-435067e70620	dcbd21e4-2164-4f08-b560-e3e06c906b12	bcc9d481-9851-423c-9b59-5769c5a810a6	LOVE	2026-01-12 08:00:26.56
49530629-b101-4a76-a50b-6c75d7b655e7	79909d3c-4b0e-4a92-88fd-41b147c0ff27	bcc9d481-9851-423c-9b59-5769c5a810a6	LIKE	2025-12-20 08:00:26.562
b29e33f8-af53-420e-bf7e-83918e99b4c0	5a8e03d7-2b9b-4330-b28a-a64d9ea31629	bcc9d481-9851-423c-9b59-5769c5a810a6	LIKE	2025-12-29 08:00:26.565
6cd3b8e0-061c-4463-a31a-c4c7fe71ee87	5120f1c6-507e-4a5b-aa9f-53241f3a2b9b	bcc9d481-9851-423c-9b59-5769c5a810a6	LOVE	2026-01-30 08:00:26.568
19495a67-ee9b-4b10-ab23-2ee1cdfabf54	b96b833c-b88d-40f6-80df-146bdd457983	bcc9d481-9851-423c-9b59-5769c5a810a6	LIKE	2025-12-19 08:00:26.571
45c999e3-c678-49c1-aa2c-535f6598a80d	6612a331-2296-4356-9611-a2c836fadf7e	bcc9d481-9851-423c-9b59-5769c5a810a6	LIKE	2026-01-16 08:00:26.574
095c0532-6ca5-4ecb-b1c7-8266d1e9bdd9	72939137-da8b-456c-834b-2a9753bbe1ba	e8d354a6-aab2-4c6d-a396-43b8017e1b01	LIKE	2026-01-29 08:00:26.576
4a172045-386a-4bda-b522-929507d5312f	71acdd69-48cd-4740-80d8-962b70085449	e8d354a6-aab2-4c6d-a396-43b8017e1b01	LIKE	2026-01-25 08:00:26.578
47dc8122-cc9f-4c70-a4fc-b16eb8a847ea	27a7b508-cfef-4e86-a91c-1cbb6ef7d556	e8d354a6-aab2-4c6d-a396-43b8017e1b01	LIKE	2025-12-22 08:00:26.581
3a311fff-ca4b-4a13-8326-85e4cd3f2150	484180d6-851b-461b-9995-07d3e3fb0116	e8d354a6-aab2-4c6d-a396-43b8017e1b01	LIKE	2025-12-13 08:00:26.582
65a7b936-0c59-4a87-99aa-439fa042a040	ba870ced-b54a-42e1-93bf-9bf0df99d544	e8d354a6-aab2-4c6d-a396-43b8017e1b01	LIKE	2025-12-21 08:00:26.585
5a0d9482-4043-4749-9d32-3015eb4c1687	444cd236-b686-4c61-87c9-2a9e87933d7b	e8d354a6-aab2-4c6d-a396-43b8017e1b01	LIKE	2025-12-02 08:00:26.587
0a892507-4508-489e-af86-c4ff8b611ba9	ba870ced-b54a-42e1-93bf-9bf0df99d544	86df4c41-ff51-4c19-8820-f409dda1079e	LIKE	2026-01-23 08:00:26.589
5c6e4c2e-18f8-46a0-9f32-c7c696db006a	238b9dac-2644-427e-8bd2-ed4c3abb8890	86df4c41-ff51-4c19-8820-f409dda1079e	LIKE	2025-12-23 08:00:26.592
4699f283-60f2-4363-baa7-185b13c68718	4338aa7b-9826-4c1f-8cf5-7d0a5331d4a2	86df4c41-ff51-4c19-8820-f409dda1079e	LIKE	2025-12-19 08:00:26.595
da878110-9042-42c6-b3a2-3aa0d52e826a	444cd236-b686-4c61-87c9-2a9e87933d7b	86df4c41-ff51-4c19-8820-f409dda1079e	LIKE	2026-01-17 08:00:26.597
7bcecba7-388c-4fc4-85cd-848357af1ff4	1475b0c5-e395-42d2-ba08-03b68d7a233c	86df4c41-ff51-4c19-8820-f409dda1079e	LIKE	2025-12-02 08:00:26.602
c9ff9258-eddb-40c3-91cd-75c6193c64fc	6e69e1f1-2d77-49da-bc84-62f12a401fdb	86df4c41-ff51-4c19-8820-f409dda1079e	LIKE	2025-12-12 08:00:26.603
c58bc4c1-1a56-47bf-85be-8eeda6d4af51	5a41b008-7743-477d-b69a-f24cd12d0ef8	86df4c41-ff51-4c19-8820-f409dda1079e	LIKE	2025-12-02 08:00:26.605
241d036c-2e50-4419-ab03-1a2d59ea5ec7	5a8e03d7-2b9b-4330-b28a-a64d9ea31629	86df4c41-ff51-4c19-8820-f409dda1079e	LIKE	2026-01-13 08:00:26.608
2bc210a2-8777-490d-a366-2e1373adf390	f72c60c1-cba6-4b45-b182-49b3b4a3e651	3f26d7a3-4ad4-4eb1-bf85-ee1c7b95342f	LIKE	2025-12-02 08:00:26.609
96513290-143e-4877-9689-81de2d1fc243	d0deb68d-283f-465f-9c10-211a4742a34e	3f26d7a3-4ad4-4eb1-bf85-ee1c7b95342f	LIKE	2026-01-05 08:00:26.611
09f54896-8bab-4e9a-a84c-89182ab0e9d3	595089e5-b503-471f-8bbb-50910e96a191	3f26d7a3-4ad4-4eb1-bf85-ee1c7b95342f	LIKE	2026-01-21 08:00:26.614
5053a5a4-bd1d-431c-a250-8b6f7496e43e	cf7c11a7-a38d-4241-81ff-180548d5f270	3f26d7a3-4ad4-4eb1-bf85-ee1c7b95342f	LIKE	2026-01-09 08:00:26.615
f0f1b630-fdb2-436f-8917-4e747cd6b7f6	40540771-bd01-477e-9bd9-1a97e9791fd1	3f26d7a3-4ad4-4eb1-bf85-ee1c7b95342f	LIKE	2026-01-18 08:00:26.617
2a5d729e-8a85-4530-95de-c632f6d155c4	e9239df4-f49b-4f39-b349-252180ecf387	3f26d7a3-4ad4-4eb1-bf85-ee1c7b95342f	LIKE	2025-12-23 08:00:26.619
50e617b9-7951-497f-bd4d-335c996a1299	4122c870-8a2d-4191-a4aa-fbf19fdaac1a	3f26d7a3-4ad4-4eb1-bf85-ee1c7b95342f	LIKE	2025-12-10 08:00:26.621
2aaaca33-9fcb-4302-84a3-ed259181577b	55ba721f-044e-4dd1-94a5-3de7dedd3bae	3f26d7a3-4ad4-4eb1-bf85-ee1c7b95342f	LIKE	2026-01-19 08:00:26.623
83e6f806-9592-46d6-9d96-fac978892a27	f2833746-a709-416f-b755-7efdf87e3ac5	3f26d7a3-4ad4-4eb1-bf85-ee1c7b95342f	LIKE	2025-12-16 08:00:26.624
ad09d631-68c4-4a42-8d68-23424adaf59b	3909ff1e-c321-480c-95e1-0176ffe923bb	3f26d7a3-4ad4-4eb1-bf85-ee1c7b95342f	LIKE	2026-01-12 08:00:26.626
6865aad7-2d98-4234-897d-48e486b60d50	5b8d59f9-35b5-4ec3-aca1-1573faf85f67	3f26d7a3-4ad4-4eb1-bf85-ee1c7b95342f	LIKE	2025-12-20 08:00:26.628
65483ecf-c3c2-4669-8e93-ed14972b4976	7bbf08be-8791-4b49-9452-3200a0b22b87	3f26d7a3-4ad4-4eb1-bf85-ee1c7b95342f	LIKE	2025-12-16 08:00:26.629
24a8b93b-5039-4314-ab08-6bd2bacdaa19	07c79298-6724-4826-934c-0c0693e8f51a	3f26d7a3-4ad4-4eb1-bf85-ee1c7b95342f	LIKE	2025-12-26 08:00:26.631
eaaea2e9-73a9-44b7-881f-f0fc0031d510	f7b55a67-e41f-4c48-902c-0ea858cd13be	3f26d7a3-4ad4-4eb1-bf85-ee1c7b95342f	LIKE	2026-01-17 08:00:26.633
dae6fa6d-f3fd-4493-a687-f42a38530982	cdfff534-6c77-4db1-a2f2-faa601ad48eb	9e0808e0-a7ef-4d37-b4b2-832b5e9e90f9	LIKE	2025-12-03 08:00:26.635
ae0ffccb-73b6-435f-a3e9-059fdf72c20b	bcf553c4-58ee-410f-a74d-d5d9370b0dde	9e0808e0-a7ef-4d37-b4b2-832b5e9e90f9	LIKE	2025-12-22 08:00:26.637
e048a123-cc09-4480-a95f-719a2874a6a2	f9b29a1f-0ca4-4839-a144-388964c66555	9e0808e0-a7ef-4d37-b4b2-832b5e9e90f9	LIKE	2025-12-07 08:00:26.639
9797f92f-5d47-4bc9-a42b-9e8c3a63f85c	deaa1ab2-4d52-4cb4-a36b-fcc583b99992	9e0808e0-a7ef-4d37-b4b2-832b5e9e90f9	LIKE	2026-01-23 08:00:26.641
8dcf13bc-866c-4f87-9360-35b947890a01	1ad14a3d-0f96-411e-a103-a0ec4dafe480	9e0808e0-a7ef-4d37-b4b2-832b5e9e90f9	LOVE	2026-01-25 08:00:26.643
c0824430-4da0-4fb0-bdc0-303b7f842257	55ba721f-044e-4dd1-94a5-3de7dedd3bae	9e0808e0-a7ef-4d37-b4b2-832b5e9e90f9	LOVE	2026-01-28 08:00:26.645
d2dd6746-d57e-412a-8760-182d1e343a0b	4122c870-8a2d-4191-a4aa-fbf19fdaac1a	3e133d99-e440-421d-b578-bf39e27451c2	LIKE	2025-12-18 08:00:26.647
62e67b36-3940-4a88-a5b2-64b7acd254d6	40540771-bd01-477e-9bd9-1a97e9791fd1	3e133d99-e440-421d-b578-bf39e27451c2	LIKE	2025-12-30 08:00:26.649
3324bb54-9107-4921-8675-5c87a172f251	b2e33f04-354c-4b61-9db1-72d4cb2bf07c	3e133d99-e440-421d-b578-bf39e27451c2	LIKE	2025-12-23 08:00:26.651
1d6b76e4-03f9-4e2e-b9b8-886c8ef6e7fa	6612a331-2296-4356-9611-a2c836fadf7e	3e133d99-e440-421d-b578-bf39e27451c2	LOVE	2025-12-26 08:00:26.653
33e4832b-86e5-4f94-9e0f-5131ddad70df	50b2fd75-14de-406c-9db1-e61588b96068	3e133d99-e440-421d-b578-bf39e27451c2	LIKE	2026-01-23 08:00:26.656
3735c739-e8d7-40c0-bf30-a8bb95f3f8f6	ae59a5c3-cd8a-4a6d-8481-e7a56bc62151	3e133d99-e440-421d-b578-bf39e27451c2	LIKE	2025-12-19 08:00:26.658
bc73c1f2-14c5-421a-99b2-001996aa6ba7	184e24f5-5cb4-4cc0-b562-addee57f91cc	3e133d99-e440-421d-b578-bf39e27451c2	LIKE	2025-12-30 08:00:26.66
aeea68c0-b6ab-44f2-bcae-bbd32bde73db	cdfff534-6c77-4db1-a2f2-faa601ad48eb	3e133d99-e440-421d-b578-bf39e27451c2	LIKE	2025-12-24 08:00:26.662
d19be564-ae76-4aaa-8c0c-0836cfd0a3e9	9f8dd3c6-3a70-4541-94a6-a4ea9ce5c5ce	3e133d99-e440-421d-b578-bf39e27451c2	LIKE	2025-12-06 08:00:26.664
5d113e7a-5561-40ad-9215-7473f94d9db1	ea32ea39-a33f-49cc-af13-04804ae4dfa0	3e133d99-e440-421d-b578-bf39e27451c2	LIKE	2026-01-19 08:00:26.666
5c985bc6-2989-4809-8c90-d610c2918559	939a0a06-1e1a-4cb8-a6b3-6737f38d264b	3e133d99-e440-421d-b578-bf39e27451c2	LIKE	2025-12-31 08:00:26.669
28ab58fe-213d-47ec-a766-1b013012e077	66e331b4-7b4b-42a6-b0be-532332292f1b	3e133d99-e440-421d-b578-bf39e27451c2	LIKE	2025-12-06 08:00:26.671
3b4c663c-4bfe-4dcc-bfeb-2514351ef74c	90166457-241e-46a6-bd4b-1a19d8bfe12a	3e133d99-e440-421d-b578-bf39e27451c2	LIKE	2026-01-05 08:00:26.673
1a7a8d37-10da-4ad6-86cb-138f718de8e2	f175b7f6-7867-45ed-ab09-0fe265040bcf	3e133d99-e440-421d-b578-bf39e27451c2	LIKE	2026-01-20 08:00:26.675
2096660f-26f0-44cf-a899-0d0614e2efa1	27a7b508-cfef-4e86-a91c-1cbb6ef7d556	3e133d99-e440-421d-b578-bf39e27451c2	LIKE	2026-01-30 08:00:26.677
92e3f4cf-d443-424a-bd0e-ba4d849339a4	e9239df4-f49b-4f39-b349-252180ecf387	3e133d99-e440-421d-b578-bf39e27451c2	LIKE	2025-12-10 08:00:26.679
44a5285e-bbee-46d5-92a2-35b3f3b92ffa	f3642b14-2e93-44f2-84fc-db0ed83b404f	3e133d99-e440-421d-b578-bf39e27451c2	LIKE	2026-01-25 08:00:26.68
89e69349-95e4-425c-ad0b-49036900bb25	484180d6-851b-461b-9995-07d3e3fb0116	e3b10f93-e71a-4de6-b027-5f5d6b167108	LIKE	2025-12-15 08:00:26.683
5baaf1a2-4fff-4146-b9dc-92acbf321aea	62c61c87-6e44-4d1e-b891-5a637c989a03	e3b10f93-e71a-4de6-b027-5f5d6b167108	LOVE	2026-01-14 08:00:26.685
47a0fd6c-b2a1-48d7-9270-4609307aea65	5a41b008-7743-477d-b69a-f24cd12d0ef8	e3b10f93-e71a-4de6-b027-5f5d6b167108	LIKE	2025-12-06 08:00:26.686
43a89f6b-cfab-4a4e-8a01-9823f3bb294b	bcf553c4-58ee-410f-a74d-d5d9370b0dde	e3b10f93-e71a-4de6-b027-5f5d6b167108	LIKE	2025-12-29 08:00:26.688
38f7de96-ab1d-4687-975f-3e93cda61b93	27a7b508-cfef-4e86-a91c-1cbb6ef7d556	e3b10f93-e71a-4de6-b027-5f5d6b167108	LIKE	2025-12-28 08:00:26.692
f8e75060-5234-4824-95a0-2fbf25006408	2f1ccf7a-022a-4f35-befc-7b401c50aa38	e3b10f93-e71a-4de6-b027-5f5d6b167108	LIKE	2026-01-02 08:00:26.695
2b312b6f-f1c2-4322-bb16-262f013a8011	f2d3c142-53b9-4641-9682-90b34edd5154	e3b10f93-e71a-4de6-b027-5f5d6b167108	LOVE	2025-12-10 08:00:26.698
17274bfe-699e-4495-a8c0-20cfc6386a2c	6e69e1f1-2d77-49da-bc84-62f12a401fdb	e3b10f93-e71a-4de6-b027-5f5d6b167108	LIKE	2026-01-10 08:00:26.699
d6413b05-fba6-466e-b042-689e075074fa	f175b7f6-7867-45ed-ab09-0fe265040bcf	e3b10f93-e71a-4de6-b027-5f5d6b167108	LOVE	2026-01-14 08:00:26.701
0fb308aa-9e92-4f86-a79d-9268716d5ca5	6f2a0c6d-6e90-4cd6-8774-abd9c722c6b4	e3b10f93-e71a-4de6-b027-5f5d6b167108	LIKE	2026-01-04 08:00:26.704
a451a7f5-a84b-4213-ae99-b2c4e0d41326	ba870ced-b54a-42e1-93bf-9bf0df99d544	e3b10f93-e71a-4de6-b027-5f5d6b167108	LIKE	2026-01-30 08:00:26.706
491dfa08-23ad-4330-b92e-cb832aecfefc	5cb29817-5c04-48e7-9559-4cfb26318863	e3b10f93-e71a-4de6-b027-5f5d6b167108	LIKE	2025-12-14 08:00:26.708
f06854da-4c96-4388-8cba-486d69e65836	79909d3c-4b0e-4a92-88fd-41b147c0ff27	e3b10f93-e71a-4de6-b027-5f5d6b167108	LIKE	2025-12-25 08:00:26.711
02584e5f-5069-4177-87b6-7ad581ba5491	71acdd69-48cd-4740-80d8-962b70085449	9755fc69-af21-4cac-9b3d-a15e33c52e57	LIKE	2025-12-14 08:00:26.713
43815d2b-3a71-4d9a-8167-f506fbedf144	8a1e0004-0a71-42b7-89ef-71bad6479a9e	9755fc69-af21-4cac-9b3d-a15e33c52e57	LOVE	2026-01-07 08:00:26.715
aef538f3-6886-4b21-a415-3849a66b11b6	5120f1c6-507e-4a5b-aa9f-53241f3a2b9b	9755fc69-af21-4cac-9b3d-a15e33c52e57	LIKE	2026-01-26 08:00:26.717
3b5cd8aa-0bb1-4f91-8261-0155757ba3fb	cf7c11a7-a38d-4241-81ff-180548d5f270	9755fc69-af21-4cac-9b3d-a15e33c52e57	LIKE	2026-01-15 08:00:26.719
d389d513-68cb-4304-bbdd-0954397c018d	48187149-2343-4ede-9d45-9ec29279dfd2	9755fc69-af21-4cac-9b3d-a15e33c52e57	LIKE	2025-12-28 08:00:26.721
748c822a-64c3-4979-830d-283e5e0a8961	2f8e040e-fdce-4d63-908b-7d290e6c7ed1	9755fc69-af21-4cac-9b3d-a15e33c52e57	LIKE	2025-12-26 08:00:26.723
e203a31f-99d4-4f05-84d6-36d470ed16ee	92472c64-e07d-4692-b1a5-618eec89121a	9755fc69-af21-4cac-9b3d-a15e33c52e57	LIKE	2026-01-25 08:00:26.725
4dba7623-7f38-4a99-a888-bda6e35f3a10	cdfff534-6c77-4db1-a2f2-faa601ad48eb	9755fc69-af21-4cac-9b3d-a15e33c52e57	LIKE	2026-01-23 08:00:26.731
c69b21fc-bfe2-4baf-be67-789b8721998d	bcf553c4-58ee-410f-a74d-d5d9370b0dde	3d78ec6b-cef7-4694-9ca1-14817fcbfbd5	LIKE	2026-01-08 08:00:26.733
6194a0bb-754b-4c31-812b-f6970b6c81d9	67475aa3-0f09-47e2-8f7a-4e7fa35a94fb	3d78ec6b-cef7-4694-9ca1-14817fcbfbd5	LIKE	2026-01-17 08:00:26.734
712caf96-8122-4527-ae67-e3f01d1d9658	4122c870-8a2d-4191-a4aa-fbf19fdaac1a	3d78ec6b-cef7-4694-9ca1-14817fcbfbd5	LIKE	2025-12-27 08:00:26.736
83e163ca-db0f-4d95-9026-7be4d648d30e	939a0a06-1e1a-4cb8-a6b3-6737f38d264b	3d78ec6b-cef7-4694-9ca1-14817fcbfbd5	LIKE	2025-12-02 08:00:26.738
9d943646-2bf5-4e1d-b2ff-f35ec971978f	71acdd69-48cd-4740-80d8-962b70085449	3d78ec6b-cef7-4694-9ca1-14817fcbfbd5	LIKE	2025-12-15 08:00:26.74
3cd1c98a-f71b-4612-9233-429cab0f874f	deaa1ab2-4d52-4cb4-a36b-fcc583b99992	3d78ec6b-cef7-4694-9ca1-14817fcbfbd5	LIKE	2026-01-17 08:00:26.743
d7216407-9a84-4b95-aba2-cc0e36c1de9b	2f1ccf7a-022a-4f35-befc-7b401c50aa38	3d78ec6b-cef7-4694-9ca1-14817fcbfbd5	LIKE	2025-12-06 08:00:26.744
8ebf36be-4436-4f1f-8c9d-b89454175930	184e24f5-5cb4-4cc0-b562-addee57f91cc	3d78ec6b-cef7-4694-9ca1-14817fcbfbd5	LIKE	2026-01-15 08:00:26.746
7475c410-2efb-4d99-a6a4-7e567df19ef0	6f2a0c6d-6e90-4cd6-8774-abd9c722c6b4	3d78ec6b-cef7-4694-9ca1-14817fcbfbd5	LIKE	2026-01-17 08:00:26.748
84a02bbc-7079-4e88-a7fc-21a21255909a	eb7f7b5a-e424-4faa-87ba-ff4d35c81cc4	3d78ec6b-cef7-4694-9ca1-14817fcbfbd5	LIKE	2025-12-08 08:00:26.749
f8e70a77-bcdb-412b-8344-69188fbd50bd	0566f71b-c470-4fd6-9223-79ec9b266a9b	3d78ec6b-cef7-4694-9ca1-14817fcbfbd5	LIKE	2025-12-22 08:00:26.752
cbf96a93-99f4-4e78-a048-6ae9df79f01f	4b1c2adf-90d0-48e2-a40e-3950a4ce2a83	dad7963e-e7ca-456f-82b4-3755125cece4	LIKE	2025-12-02 08:00:26.755
de3b63f6-7d45-4d20-83aa-2e8c72b9ab0f	6f2a0c6d-6e90-4cd6-8774-abd9c722c6b4	dad7963e-e7ca-456f-82b4-3755125cece4	LIKE	2025-12-08 08:00:26.757
3f5b0a04-c7a9-43f2-80d9-3e056acfd5de	d0deb68d-283f-465f-9c10-211a4742a34e	dad7963e-e7ca-456f-82b4-3755125cece4	LIKE	2026-01-13 08:00:26.76
c07f6519-b4dd-4102-97a0-369890477324	e7c55ea4-ee93-4b5a-8410-e27c6e65483b	dad7963e-e7ca-456f-82b4-3755125cece4	LIKE	2026-01-01 08:00:26.761
fd38a7e2-9c62-4981-b763-a1b49090d4e5	ba870ced-b54a-42e1-93bf-9bf0df99d544	dad7963e-e7ca-456f-82b4-3755125cece4	LIKE	2025-12-20 08:00:26.763
70c26c83-fd89-476c-ba79-2d3f7915693f	62c61c87-6e44-4d1e-b891-5a637c989a03	dad7963e-e7ca-456f-82b4-3755125cece4	LIKE	2025-12-09 08:00:26.766
637ef904-8212-4ad6-9d15-4eb1322b7bef	dcbd21e4-2164-4f08-b560-e3e06c906b12	dad7963e-e7ca-456f-82b4-3755125cece4	LIKE	2025-12-05 08:00:26.768
f4cc8212-fccd-4cbd-bff2-b51a5b69d34a	e9239df4-f49b-4f39-b349-252180ecf387	dad7963e-e7ca-456f-82b4-3755125cece4	LIKE	2025-12-23 08:00:26.77
b4b239f0-3755-4a16-9885-18fbb7ab3283	e83739b5-9a5b-43a0-853a-f02ef6abc694	dad7963e-e7ca-456f-82b4-3755125cece4	LIKE	2026-01-05 08:00:26.773
89b14f67-85f2-42d9-9ffd-3263c196dba7	66e331b4-7b4b-42a6-b0be-532332292f1b	dad7963e-e7ca-456f-82b4-3755125cece4	LIKE	2026-01-08 08:00:26.776
7e2da335-7e3b-4c93-bbfb-776cf14dd531	38c839cc-f81a-4998-8afa-aaf4ba466248	dad7963e-e7ca-456f-82b4-3755125cece4	LIKE	2025-12-31 08:00:26.779
e411b318-2d21-4b67-9e72-0c950ca57761	3909ff1e-c321-480c-95e1-0176ffe923bb	dad7963e-e7ca-456f-82b4-3755125cece4	LIKE	2025-12-10 08:00:26.783
a3bc7ade-f7fc-4a3e-a4c7-0e75fdf784e7	4338aa7b-9826-4c1f-8cf5-7d0a5331d4a2	dad7963e-e7ca-456f-82b4-3755125cece4	LIKE	2025-12-21 08:00:26.784
86d05fdb-ae2f-47df-a25d-a10b030b674c	312d7038-0402-4693-8c0e-5c7fedf8519f	dad7963e-e7ca-456f-82b4-3755125cece4	LIKE	2026-01-05 08:00:26.787
ee42a671-142d-4c40-82f8-5873b3944eb1	48187149-2343-4ede-9d45-9ec29279dfd2	dad7963e-e7ca-456f-82b4-3755125cece4	LIKE	2026-01-29 08:00:26.789
629a8236-61d5-4fca-9611-7a0a7a44a87b	2f8e040e-fdce-4d63-908b-7d290e6c7ed1	dad7963e-e7ca-456f-82b4-3755125cece4	LOVE	2026-01-15 08:00:26.791
60739245-7f96-427a-9b00-ce9b1e52c370	90166457-241e-46a6-bd4b-1a19d8bfe12a	dad7963e-e7ca-456f-82b4-3755125cece4	LIKE	2026-01-26 08:00:26.795
ea8aaefa-f7de-40bb-b5ec-f70510f8d582	0587db93-4151-4825-8cbf-d96e5893212b	d8df278b-4c38-4450-b244-87f07062175f	LIKE	2026-01-19 08:00:26.797
7017a7ea-1db7-4962-82d5-59061962295b	4122c870-8a2d-4191-a4aa-fbf19fdaac1a	d8df278b-4c38-4450-b244-87f07062175f	LIKE	2025-12-05 08:00:26.799
56071fad-522b-4477-af87-ad8c502ed740	67475aa3-0f09-47e2-8f7a-4e7fa35a94fb	d8df278b-4c38-4450-b244-87f07062175f	LIKE	2025-12-15 08:00:26.802
3ace0f03-801c-40f4-93b8-2579552b7b21	2f1ccf7a-022a-4f35-befc-7b401c50aa38	d8df278b-4c38-4450-b244-87f07062175f	LOVE	2025-12-28 08:00:26.804
eb17a556-f626-4ada-9628-eb2dc6665191	d279d4a9-1412-4a74-a40b-44954082a13c	d8df278b-4c38-4450-b244-87f07062175f	LIKE	2026-01-25 08:00:26.808
e782a720-98d9-4056-857a-9cba51d01578	5a41b008-7743-477d-b69a-f24cd12d0ef8	2baf99b2-9b1e-4e88-b38d-8bffb6560354	LIKE	2025-12-06 08:00:26.81
e6c51449-7a46-4117-9a69-bc178d50701b	b38028d8-8c4a-4c0d-8759-a79b6ed93fc1	2baf99b2-9b1e-4e88-b38d-8bffb6560354	LIKE	2025-12-14 08:00:26.812
8a80ef6e-1ff8-4553-900a-809a81657dd6	50b2fd75-14de-406c-9db1-e61588b96068	2baf99b2-9b1e-4e88-b38d-8bffb6560354	LOVE	2026-01-14 08:00:26.814
198af823-bcee-4a05-9ec4-0a66eec33268	5a8e03d7-2b9b-4330-b28a-a64d9ea31629	2baf99b2-9b1e-4e88-b38d-8bffb6560354	LIKE	2025-12-24 08:00:26.817
5e43f73e-c995-4f8a-8b4d-759ef81824c9	6f2a0c6d-6e90-4cd6-8774-abd9c722c6b4	2baf99b2-9b1e-4e88-b38d-8bffb6560354	LIKE	2026-01-10 08:00:26.82
a92e5b6a-3a61-46de-8c2d-ecc0b61cb4d8	0566f71b-c470-4fd6-9223-79ec9b266a9b	2baf99b2-9b1e-4e88-b38d-8bffb6560354	LIKE	2026-01-01 08:00:26.823
bd13a819-bfbf-4cc7-9166-55dfd73584cf	2f1ccf7a-022a-4f35-befc-7b401c50aa38	2baf99b2-9b1e-4e88-b38d-8bffb6560354	LIKE	2026-01-20 08:00:26.825
44f06cfe-7f74-49ea-9176-0bcafaa0368a	9f8dd3c6-3a70-4541-94a6-a4ea9ce5c5ce	2baf99b2-9b1e-4e88-b38d-8bffb6560354	LOVE	2025-12-12 08:00:26.829
76df8776-6e77-43e4-a56c-77731885401e	d0deb68d-283f-465f-9c10-211a4742a34e	2baf99b2-9b1e-4e88-b38d-8bffb6560354	LIKE	2026-01-27 08:00:26.831
11f1ca09-31c0-4041-8f44-fcdc33b69945	cf7c11a7-a38d-4241-81ff-180548d5f270	2baf99b2-9b1e-4e88-b38d-8bffb6560354	LIKE	2026-01-09 08:00:26.833
8cc09e69-8a64-4840-88ef-21246c09c05c	84fa5ae9-2b10-4102-83b0-391accda9aba	2baf99b2-9b1e-4e88-b38d-8bffb6560354	LIKE	2026-01-24 08:00:26.837
1c0a0fce-c375-4e69-bf69-b66ab20bbedf	72939137-da8b-456c-834b-2a9753bbe1ba	2baf99b2-9b1e-4e88-b38d-8bffb6560354	LIKE	2026-01-10 08:00:26.839
f5790b32-d0cd-4152-98cf-f97437c1bb62	dcbd21e4-2164-4f08-b560-e3e06c906b12	2baf99b2-9b1e-4e88-b38d-8bffb6560354	LIKE	2026-01-06 08:00:26.842
fb583c67-11da-4a88-9352-e2b1b9ab5851	7bbf08be-8791-4b49-9452-3200a0b22b87	2baf99b2-9b1e-4e88-b38d-8bffb6560354	LIKE	2026-01-14 08:00:26.844
1d1231fa-3e2a-4c79-9ebb-cbc86a5be61a	917efd28-bbfe-4c3f-bf93-4af3e5c2c31e	2baf99b2-9b1e-4e88-b38d-8bffb6560354	LIKE	2026-01-18 08:00:26.846
1501b267-f255-4273-980e-dbc9d4126f9b	5b8d59f9-35b5-4ec3-aca1-1573faf85f67	2baf99b2-9b1e-4e88-b38d-8bffb6560354	LIKE	2026-01-25 08:00:26.849
78559b89-2f14-4e99-b817-2b5621fa3e31	67475aa3-0f09-47e2-8f7a-4e7fa35a94fb	2baf99b2-9b1e-4e88-b38d-8bffb6560354	LIKE	2026-01-15 08:00:26.852
c9f3974a-3214-4bfe-8c19-bcc0552d584c	4b1c2adf-90d0-48e2-a40e-3950a4ce2a83	2baf99b2-9b1e-4e88-b38d-8bffb6560354	LIKE	2025-12-05 08:00:26.854
47c8d572-efcc-461d-8437-e53aca396c08	e9239df4-f49b-4f39-b349-252180ecf387	2baf99b2-9b1e-4e88-b38d-8bffb6560354	LIKE	2026-01-04 08:00:26.858
cd393763-a9dd-460b-9043-166f150422fb	dcbd21e4-2164-4f08-b560-e3e06c906b12	1d23ae27-a731-4e3c-84cb-100c355cf77d	LIKE	2026-01-23 08:15:19.923
e24ab284-e037-4617-bbcb-2384c9f86b7b	55ba721f-044e-4dd1-94a5-3de7dedd3bae	1d23ae27-a731-4e3c-84cb-100c355cf77d	LIKE	2026-01-23 08:15:19.925
3f489c3b-9164-4b86-a0c1-b9795e9702b5	4122c870-8a2d-4191-a4aa-fbf19fdaac1a	1d23ae27-a731-4e3c-84cb-100c355cf77d	LIKE	2025-12-10 08:15:19.928
62897431-e3d1-422e-a234-263890b42663	67475aa3-0f09-47e2-8f7a-4e7fa35a94fb	1d23ae27-a731-4e3c-84cb-100c355cf77d	LIKE	2025-12-25 08:15:19.93
37e5e28a-9323-4d5e-a153-375f5d80339d	48187149-2343-4ede-9d45-9ec29279dfd2	1d23ae27-a731-4e3c-84cb-100c355cf77d	LIKE	2025-12-23 08:15:19.932
3d9f6bdb-d140-4acd-9166-df46603dfcea	5120f1c6-507e-4a5b-aa9f-53241f3a2b9b	1dde3a6b-cd87-4f0f-9a0f-15b8ac3acd75	LIKE	2026-01-07 08:15:19.935
b2f118b2-7702-41eb-bc56-8361a8deebaa	8c63e328-754f-41b3-96b2-febcc8db78f1	1dde3a6b-cd87-4f0f-9a0f-15b8ac3acd75	LIKE	2026-01-26 08:15:19.938
31009a67-89a5-40e2-be63-13e518a7ca09	4338aa7b-9826-4c1f-8cf5-7d0a5331d4a2	1dde3a6b-cd87-4f0f-9a0f-15b8ac3acd75	LIKE	2025-12-10 08:15:19.94
5ccc4a3c-888c-4288-aea6-44a0e0ede491	38c839cc-f81a-4998-8afa-aaf4ba466248	1dde3a6b-cd87-4f0f-9a0f-15b8ac3acd75	LIKE	2025-12-25 08:15:19.942
9d4abcb4-7886-4cd1-b9b1-e32d62b215e4	71acdd69-48cd-4740-80d8-962b70085449	1dde3a6b-cd87-4f0f-9a0f-15b8ac3acd75	LIKE	2025-12-18 08:15:19.944
42664c58-d03b-4959-82c1-b1078975b7f5	dcbd21e4-2164-4f08-b560-e3e06c906b12	1dde3a6b-cd87-4f0f-9a0f-15b8ac3acd75	LIKE	2026-01-15 08:15:19.946
5aaebc7c-ff9d-4d94-9951-4fea35ef0a48	5cb29817-5c04-48e7-9559-4cfb26318863	1dde3a6b-cd87-4f0f-9a0f-15b8ac3acd75	LIKE	2025-12-02 08:15:19.948
6fcf0021-0770-4996-bfe1-1f23596ee0d3	f175b7f6-7867-45ed-ab09-0fe265040bcf	8335563a-9cd0-43c4-93b6-3e55b1350f3c	LIKE	2025-12-19 08:15:19.951
d6cbe598-abf7-4f40-a9b0-1de71b6a4756	3909ff1e-c321-480c-95e1-0176ffe923bb	8335563a-9cd0-43c4-93b6-3e55b1350f3c	LIKE	2025-12-20 08:15:19.953
cc27152d-39a9-4524-9d33-8796de1faf43	03022b17-5967-486d-818e-85a2b71056d5	8335563a-9cd0-43c4-93b6-3e55b1350f3c	LIKE	2025-12-15 08:15:19.955
7aae5fe8-3f5d-45b7-8c92-83bbfd753655	4338aa7b-9826-4c1f-8cf5-7d0a5331d4a2	8335563a-9cd0-43c4-93b6-3e55b1350f3c	LIKE	2025-12-08 08:15:19.957
8ee2cdca-b7ca-412f-acae-c72341ece663	5cb29817-5c04-48e7-9559-4cfb26318863	8335563a-9cd0-43c4-93b6-3e55b1350f3c	LIKE	2025-12-13 08:15:19.959
d78b1a63-72e4-48d0-8814-cee4d0f53e29	b38028d8-8c4a-4c0d-8759-a79b6ed93fc1	8335563a-9cd0-43c4-93b6-3e55b1350f3c	LIKE	2025-12-31 08:15:19.961
2f547491-15b1-4769-a35b-824859482145	15aec74c-1343-4c15-a58d-887b6a06b1f3	8335563a-9cd0-43c4-93b6-3e55b1350f3c	LIKE	2026-01-11 08:15:19.963
61cba107-644f-4e48-a5ff-ebf9d9a9d5b2	6612a331-2296-4356-9611-a2c836fadf7e	8335563a-9cd0-43c4-93b6-3e55b1350f3c	LIKE	2026-01-11 08:15:19.965
f302e9dd-843f-4c4a-8106-889d8dfe39e0	bcf553c4-58ee-410f-a74d-d5d9370b0dde	8335563a-9cd0-43c4-93b6-3e55b1350f3c	LIKE	2026-01-29 08:15:19.967
2d5a58fa-7c16-4069-8de1-3864c7c3ade8	27a7b508-cfef-4e86-a91c-1cbb6ef7d556	8335563a-9cd0-43c4-93b6-3e55b1350f3c	LIKE	2026-01-16 08:15:19.969
d5a2ef3d-b86a-4934-81d7-3cfc9b5eb960	238b9dac-2644-427e-8bd2-ed4c3abb8890	8335563a-9cd0-43c4-93b6-3e55b1350f3c	LIKE	2026-01-21 08:15:19.972
cd8c1440-fa6a-4c84-9c8e-c8b137cc81a4	f72c60c1-cba6-4b45-b182-49b3b4a3e651	8335563a-9cd0-43c4-93b6-3e55b1350f3c	LIKE	2025-12-16 08:15:19.975
c8d5cb46-51f0-4b46-8319-57217bb095ff	62c61c87-6e44-4d1e-b891-5a637c989a03	8335563a-9cd0-43c4-93b6-3e55b1350f3c	LIKE	2025-12-07 08:15:19.978
fedbcec4-a7e8-4ff7-b15b-df48098b0a76	5a41b008-7743-477d-b69a-f24cd12d0ef8	8335563a-9cd0-43c4-93b6-3e55b1350f3c	LIKE	2025-12-06 08:15:19.98
2580809d-e153-4606-a19a-965127627a1d	79909d3c-4b0e-4a92-88fd-41b147c0ff27	dc82f92a-bf51-4b9f-9402-668ab7c06af1	LIKE	2025-12-05 08:15:19.982
14729e2c-6d0c-4d1b-9832-bf71a0e86dc9	27a7b508-cfef-4e86-a91c-1cbb6ef7d556	dc82f92a-bf51-4b9f-9402-668ab7c06af1	LIKE	2025-12-18 08:15:19.984
7a0473c4-c4ff-41a0-aa7b-d98a5189dba2	dcbd21e4-2164-4f08-b560-e3e06c906b12	dc82f92a-bf51-4b9f-9402-668ab7c06af1	LIKE	2025-12-22 08:15:19.986
b5d6773a-3492-4726-9017-d8b630debac2	84fa5ae9-2b10-4102-83b0-391accda9aba	dc82f92a-bf51-4b9f-9402-668ab7c06af1	LIKE	2026-01-29 08:15:19.988
c11f555b-c5ce-4fc5-bafa-3d75c0d146e3	6e69e1f1-2d77-49da-bc84-62f12a401fdb	dc82f92a-bf51-4b9f-9402-668ab7c06af1	LIKE	2025-12-20 08:15:19.99
766c3863-7a62-4ffc-8e73-56bda9fd37ef	e9239df4-f49b-4f39-b349-252180ecf387	dc82f92a-bf51-4b9f-9402-668ab7c06af1	LIKE	2026-01-09 08:15:19.993
30d7a4d7-9252-4e90-95a3-3dca16c9e7b9	0566f71b-c470-4fd6-9223-79ec9b266a9b	dc82f92a-bf51-4b9f-9402-668ab7c06af1	LIKE	2025-12-31 08:15:19.995
814e884e-6879-4bb4-9cfb-e584eefeafc1	5120f1c6-507e-4a5b-aa9f-53241f3a2b9b	dc82f92a-bf51-4b9f-9402-668ab7c06af1	LIKE	2026-01-02 08:15:19.997
f36399d2-77ef-42bc-915d-5522aae9c468	6f2a0c6d-6e90-4cd6-8774-abd9c722c6b4	dc82f92a-bf51-4b9f-9402-668ab7c06af1	LIKE	2025-12-06 08:15:20
0b9e2689-9252-4cf4-80a8-f46f455cb027	eb7f7b5a-e424-4faa-87ba-ff4d35c81cc4	dc82f92a-bf51-4b9f-9402-668ab7c06af1	LIKE	2026-01-28 08:15:20.002
87e74e95-eb03-45ef-94cf-f0e8c75171ce	91fb42f5-a87c-4ec0-97bd-2ca1fc3eff88	dc82f92a-bf51-4b9f-9402-668ab7c06af1	LIKE	2025-12-21 08:15:20.004
502683e8-0991-49d8-a1fc-1571a5ba9100	1ad14a3d-0f96-411e-a103-a0ec4dafe480	d41389e0-7f3c-4bbd-82f8-cb4086ed2004	LIKE	2026-01-11 08:15:20.007
aba52908-26f9-4fea-9365-504b01a82436	ea32ea39-a33f-49cc-af13-04804ae4dfa0	d41389e0-7f3c-4bbd-82f8-cb4086ed2004	LIKE	2026-01-04 08:15:20.01
ec84c420-a3af-46b2-8a44-b3d85ff5383b	40540771-bd01-477e-9bd9-1a97e9791fd1	d41389e0-7f3c-4bbd-82f8-cb4086ed2004	LIKE	2025-12-26 08:15:20.012
fb53e1bd-2eca-4586-b4da-40e172cde294	07c79298-6724-4826-934c-0c0693e8f51a	d41389e0-7f3c-4bbd-82f8-cb4086ed2004	LIKE	2026-01-28 08:15:20.014
06c2f4f4-7f97-4a03-a37a-f3ba0e7b4ddc	27a7b508-cfef-4e86-a91c-1cbb6ef7d556	d41389e0-7f3c-4bbd-82f8-cb4086ed2004	LOVE	2026-01-04 08:15:20.016
1ac36791-10f2-49df-9ba4-eeef351206ab	66e331b4-7b4b-42a6-b0be-532332292f1b	d41389e0-7f3c-4bbd-82f8-cb4086ed2004	LIKE	2025-12-19 08:15:20.019
cbaa58c6-8d19-455d-a1e3-b8119fd98644	2f8e040e-fdce-4d63-908b-7d290e6c7ed1	d41389e0-7f3c-4bbd-82f8-cb4086ed2004	LIKE	2025-12-08 08:15:20.021
04518c43-f98d-4de4-aa0c-5298dce82f6a	50b2fd75-14de-406c-9db1-e61588b96068	d41389e0-7f3c-4bbd-82f8-cb4086ed2004	LIKE	2026-01-20 08:15:20.023
4404cddf-89af-4338-989e-e1ff993ac3be	f3642b14-2e93-44f2-84fc-db0ed83b404f	d41389e0-7f3c-4bbd-82f8-cb4086ed2004	LIKE	2026-01-07 08:15:20.026
189c1b74-a134-46e9-a395-828f881240bf	1475b0c5-e395-42d2-ba08-03b68d7a233c	183e97e4-143e-4ee2-b3f5-7882d4ff1ad7	LIKE	2025-12-02 08:15:20.028
ef4b824b-4b9a-417a-907a-fab9d30c8110	55ba721f-044e-4dd1-94a5-3de7dedd3bae	183e97e4-143e-4ee2-b3f5-7882d4ff1ad7	LIKE	2025-12-22 08:15:20.029
844f707d-51dd-4bd6-a3fb-bf869cfe4543	2f1ccf7a-022a-4f35-befc-7b401c50aa38	183e97e4-143e-4ee2-b3f5-7882d4ff1ad7	LIKE	2026-01-09 08:15:20.031
7bf1cf4a-6c84-4dbf-ae9a-7c195c2f62fb	917efd28-bbfe-4c3f-bf93-4af3e5c2c31e	183e97e4-143e-4ee2-b3f5-7882d4ff1ad7	LIKE	2025-12-24 08:15:20.035
65214283-0b5b-4cab-89be-0a4a4d9b16a0	bcf553c4-58ee-410f-a74d-d5d9370b0dde	183e97e4-143e-4ee2-b3f5-7882d4ff1ad7	LIKE	2026-01-09 08:15:20.037
3d7e252e-9861-4904-b47d-24473f449fe1	184e24f5-5cb4-4cc0-b562-addee57f91cc	183e97e4-143e-4ee2-b3f5-7882d4ff1ad7	LIKE	2026-01-11 08:15:20.039
29ea60d1-3792-461e-bb92-49c4b4ec3d03	92472c64-e07d-4692-b1a5-618eec89121a	183e97e4-143e-4ee2-b3f5-7882d4ff1ad7	LIKE	2025-12-10 08:15:20.041
4159d13d-49fc-4e62-b2ca-2d6709c03302	5cb29817-5c04-48e7-9559-4cfb26318863	183e97e4-143e-4ee2-b3f5-7882d4ff1ad7	LIKE	2025-12-09 08:15:20.043
6e85d04b-7a49-4d12-a16c-6d2dd29ce4f3	ce7ce853-42a6-4b2c-b1ac-3f657dcbbf6b	183e97e4-143e-4ee2-b3f5-7882d4ff1ad7	LOVE	2026-01-06 08:15:20.046
4c136ad8-0dec-4203-ab92-0e327b632dfd	62c61c87-6e44-4d1e-b891-5a637c989a03	183e97e4-143e-4ee2-b3f5-7882d4ff1ad7	LIKE	2025-12-24 08:15:20.049
d1c47433-bf8a-481a-ac95-58a9abe2fa54	8a1e0004-0a71-42b7-89ef-71bad6479a9e	183e97e4-143e-4ee2-b3f5-7882d4ff1ad7	LIKE	2026-01-08 08:15:20.051
4af0e103-fb03-4dc1-a5ff-c76ef319276b	8a1e0004-0a71-42b7-89ef-71bad6479a9e	ea755ed4-abdb-44bd-8c96-93eaaf45caf0	LIKE	2025-12-02 08:15:20.053
ef010844-10aa-42a6-8033-76c664aeb741	f3642b14-2e93-44f2-84fc-db0ed83b404f	ea755ed4-abdb-44bd-8c96-93eaaf45caf0	LIKE	2025-12-08 08:15:20.055
f7abb7c7-f7d4-4f46-b088-3c0c5a014ba7	444cd236-b686-4c61-87c9-2a9e87933d7b	ea755ed4-abdb-44bd-8c96-93eaaf45caf0	LIKE	2025-12-10 08:15:20.057
8521b0d1-e0cb-42f8-8721-95022dd0d1a4	5120f1c6-507e-4a5b-aa9f-53241f3a2b9b	ea755ed4-abdb-44bd-8c96-93eaaf45caf0	LIKE	2025-12-08 08:15:20.06
69388ce2-40bf-4a9e-b3e3-dffd01956cc7	2f1ccf7a-022a-4f35-befc-7b401c50aa38	ea755ed4-abdb-44bd-8c96-93eaaf45caf0	LIKE	2025-12-23 08:15:20.062
956b8aa8-4620-4c18-afd6-3fd1aba4782b	84fa5ae9-2b10-4102-83b0-391accda9aba	ea755ed4-abdb-44bd-8c96-93eaaf45caf0	LIKE	2025-12-17 08:15:20.063
e060ea50-71dc-46f1-b5af-9b47ccf30937	f2833746-a709-416f-b755-7efdf87e3ac5	ea755ed4-abdb-44bd-8c96-93eaaf45caf0	LIKE	2026-01-09 08:15:20.065
2c545e17-48bd-419f-9ea4-e84de58abc49	6f2a0c6d-6e90-4cd6-8774-abd9c722c6b4	ea755ed4-abdb-44bd-8c96-93eaaf45caf0	LIKE	2025-12-23 08:15:20.067
9932fe43-599b-486a-af0d-e808c271fc3f	b96b833c-b88d-40f6-80df-146bdd457983	ea755ed4-abdb-44bd-8c96-93eaaf45caf0	LIKE	2026-01-16 08:15:20.069
d0a79d94-3d92-4ff1-b104-4c255dbd6e0b	238b9dac-2644-427e-8bd2-ed4c3abb8890	ea755ed4-abdb-44bd-8c96-93eaaf45caf0	LIKE	2026-01-23 08:15:20.07
697c1a5d-9a33-4fe5-887d-c3446939d40d	50b2fd75-14de-406c-9db1-e61588b96068	ea755ed4-abdb-44bd-8c96-93eaaf45caf0	LIKE	2025-12-22 08:15:20.072
ca6e7f40-79ef-4e4d-a114-95a5c233b0b3	71acdd69-48cd-4740-80d8-962b70085449	ea755ed4-abdb-44bd-8c96-93eaaf45caf0	LIKE	2025-12-23 08:15:20.074
f0e4bc10-cf16-4b63-9269-bda163d8a534	e9239df4-f49b-4f39-b349-252180ecf387	ea755ed4-abdb-44bd-8c96-93eaaf45caf0	LIKE	2026-01-15 08:15:20.077
490fcb2d-036f-4bc7-bef5-6eebbe6cbb02	92472c64-e07d-4692-b1a5-618eec89121a	ea755ed4-abdb-44bd-8c96-93eaaf45caf0	LIKE	2026-01-29 08:15:20.079
9141e4e2-034c-4ca7-9d39-0b989a2f363d	f2d3c142-53b9-4641-9682-90b34edd5154	ea755ed4-abdb-44bd-8c96-93eaaf45caf0	LIKE	2025-12-07 08:15:20.081
be1542d3-4975-4ed2-928f-526672920c36	5cb29817-5c04-48e7-9559-4cfb26318863	bcf65b61-4e01-419e-a291-cd5837eedddf	LIKE	2025-12-09 08:15:20.083
e1bebe33-3a90-45b0-b419-cec67e8dd96a	38c839cc-f81a-4998-8afa-aaf4ba466248	bcf65b61-4e01-419e-a291-cd5837eedddf	LIKE	2025-12-24 08:15:20.086
3cf55aa9-6166-416a-bbf1-ffb69f60242c	71acdd69-48cd-4740-80d8-962b70085449	bcf65b61-4e01-419e-a291-cd5837eedddf	LIKE	2025-12-06 08:15:20.088
02f25c09-775c-4670-9024-36b24e2c71f1	40540771-bd01-477e-9bd9-1a97e9791fd1	bcf65b61-4e01-419e-a291-cd5837eedddf	LIKE	2026-01-29 08:15:20.091
98084139-4e24-4688-9934-f32932e328c3	5a41b008-7743-477d-b69a-f24cd12d0ef8	bcf65b61-4e01-419e-a291-cd5837eedddf	LIKE	2026-01-15 08:15:20.093
50be5ff4-7346-4887-ba2c-5c58f9e0af06	595089e5-b503-471f-8bbb-50910e96a191	bcf65b61-4e01-419e-a291-cd5837eedddf	LOVE	2025-12-17 08:15:20.097
ea4cc5f1-a891-474f-8d19-2059de078c97	27a7b508-cfef-4e86-a91c-1cbb6ef7d556	bcf65b61-4e01-419e-a291-cd5837eedddf	LIKE	2026-01-10 08:15:20.1
9e9af80f-8ab7-4541-91b8-bbd6aec3ab31	b6afb299-43be-4bc6-86ee-434584f5f0a2	bcf65b61-4e01-419e-a291-cd5837eedddf	LOVE	2025-12-07 08:15:20.102
4cacaf6d-d013-431e-8763-5abdf0e8d8db	50b2fd75-14de-406c-9db1-e61588b96068	bcf65b61-4e01-419e-a291-cd5837eedddf	LIKE	2026-01-14 08:15:20.105
49458d07-24d7-4843-b866-e8ca4c2cbb7f	6f2a0c6d-6e90-4cd6-8774-abd9c722c6b4	bcf65b61-4e01-419e-a291-cd5837eedddf	LIKE	2026-01-17 08:15:20.107
0a8ff786-dbfd-49fe-9c93-9bb47b7ba4b2	312d7038-0402-4693-8c0e-5c7fedf8519f	bcf65b61-4e01-419e-a291-cd5837eedddf	LOVE	2026-01-10 08:15:20.11
582a6408-13f7-4931-b271-3ea13eb08074	0566f71b-c470-4fd6-9223-79ec9b266a9b	bcf65b61-4e01-419e-a291-cd5837eedddf	LIKE	2026-01-28 08:15:20.112
c468f5bc-c6cd-4323-ac39-93ec0a03ab67	91fb42f5-a87c-4ec0-97bd-2ca1fc3eff88	bcf65b61-4e01-419e-a291-cd5837eedddf	LIKE	2026-01-20 08:15:20.113
1a5c0378-66f9-464c-b6a8-26d31c154c1d	f175b7f6-7867-45ed-ab09-0fe265040bcf	bcf65b61-4e01-419e-a291-cd5837eedddf	LIKE	2025-12-12 08:15:20.116
659b7518-bc59-4063-bd51-465e429ebadc	6e69e1f1-2d77-49da-bc84-62f12a401fdb	bcf65b61-4e01-419e-a291-cd5837eedddf	LIKE	2025-12-03 08:15:20.118
26710429-295e-4ad0-9b9a-d20a0f62aa46	b96b833c-b88d-40f6-80df-146bdd457983	bcf65b61-4e01-419e-a291-cd5837eedddf	LOVE	2025-12-05 08:15:20.12
8946b8b7-0539-4777-bd2f-231cf6639d8d	66e331b4-7b4b-42a6-b0be-532332292f1b	3028ad20-a8ae-4916-bf2d-887d78518405	LIKE	2026-01-08 08:15:20.122
8b564623-3c25-4430-9a56-dc2feb838186	38c839cc-f81a-4998-8afa-aaf4ba466248	3028ad20-a8ae-4916-bf2d-887d78518405	LIKE	2026-01-15 08:15:20.124
1b6b46d9-5a55-4612-92ac-d049d27c6a12	27a7b508-cfef-4e86-a91c-1cbb6ef7d556	3028ad20-a8ae-4916-bf2d-887d78518405	LIKE	2026-01-04 08:15:20.126
6fd1ede1-5793-4d90-9ce5-b8e6e10a7894	b38028d8-8c4a-4c0d-8759-a79b6ed93fc1	3028ad20-a8ae-4916-bf2d-887d78518405	LIKE	2025-12-22 08:15:20.129
73263f1b-426a-4b08-a961-46d22e103d59	2f8e040e-fdce-4d63-908b-7d290e6c7ed1	3028ad20-a8ae-4916-bf2d-887d78518405	LIKE	2025-12-16 08:15:20.131
cc35e94d-fb2e-473e-8285-85e27150bba5	84fa5ae9-2b10-4102-83b0-391accda9aba	3028ad20-a8ae-4916-bf2d-887d78518405	LIKE	2025-12-30 08:15:20.133
5a14af32-f987-43e6-9cd5-73337b311a00	1475b0c5-e395-42d2-ba08-03b68d7a233c	3028ad20-a8ae-4916-bf2d-887d78518405	LIKE	2025-12-09 08:15:20.134
47ad8060-4e53-4ebb-863c-d2b97e99faa5	0566f71b-c470-4fd6-9223-79ec9b266a9b	3028ad20-a8ae-4916-bf2d-887d78518405	LIKE	2026-01-10 08:15:20.137
c737633d-00cc-45a4-adb7-1ef7d8d4c989	f3642b14-2e93-44f2-84fc-db0ed83b404f	719957a1-5940-496d-bb28-140d231843ec	LIKE	2026-01-28 08:15:20.139
ad2ae36c-ebc8-4a7a-a0b1-bb3169129b90	ae59a5c3-cd8a-4a6d-8481-e7a56bc62151	719957a1-5940-496d-bb28-140d231843ec	LIKE	2025-12-20 08:15:20.14
17fcb3e8-889f-4392-9251-cf041f7f9cdc	f175b7f6-7867-45ed-ab09-0fe265040bcf	719957a1-5940-496d-bb28-140d231843ec	LOVE	2026-01-14 08:15:20.142
5bab236b-a98e-4f36-8ece-c0f0cc327fd3	5120f1c6-507e-4a5b-aa9f-53241f3a2b9b	719957a1-5940-496d-bb28-140d231843ec	LIKE	2025-12-05 08:15:20.145
27db30b4-f4cc-42fd-951e-ec799aa4d83a	b6afb299-43be-4bc6-86ee-434584f5f0a2	719957a1-5940-496d-bb28-140d231843ec	LIKE	2026-01-22 08:15:20.147
d3452bc4-dd91-4a31-ade6-94ec26248998	312d7038-0402-4693-8c0e-5c7fedf8519f	719957a1-5940-496d-bb28-140d231843ec	LIKE	2025-12-23 08:15:20.149
65d3df08-1587-4fa1-9de5-f35ddf3ebc00	1475b0c5-e395-42d2-ba08-03b68d7a233c	719957a1-5940-496d-bb28-140d231843ec	LIKE	2025-12-14 08:15:20.152
24165ec1-73f8-4bb7-a227-06701b8695a5	b38028d8-8c4a-4c0d-8759-a79b6ed93fc1	643f6b82-ef57-41fe-8049-8588069c0b83	LIKE	2026-01-22 08:15:20.154
8fe5f348-5c86-4454-b720-66be8422a62d	38c839cc-f81a-4998-8afa-aaf4ba466248	643f6b82-ef57-41fe-8049-8588069c0b83	LIKE	2026-01-26 08:15:20.155
497302d9-04e1-4613-9be3-451854a4b106	ec253d46-469a-4ab5-baa1-16ca991871c5	643f6b82-ef57-41fe-8049-8588069c0b83	LIKE	2025-12-14 08:15:20.157
a7791ff5-3b98-4bdc-88c6-7800c2e29a77	184e24f5-5cb4-4cc0-b562-addee57f91cc	643f6b82-ef57-41fe-8049-8588069c0b83	LIKE	2026-01-23 08:15:20.159
13678da7-5ad5-4682-9d8e-50c8e7a81958	f9b29a1f-0ca4-4839-a144-388964c66555	643f6b82-ef57-41fe-8049-8588069c0b83	LIKE	2025-12-10 08:15:20.161
3f26bc2a-1f97-43f4-8629-1f8b74a26831	99c9a347-c807-45d1-ae17-1b98989b11d5	643f6b82-ef57-41fe-8049-8588069c0b83	LIKE	2025-12-15 08:15:20.163
0666672b-9ec6-4b29-b1c0-101cc9e5695d	92472c64-e07d-4692-b1a5-618eec89121a	643f6b82-ef57-41fe-8049-8588069c0b83	LIKE	2026-01-26 08:15:20.164
cfb3d1dc-960b-4404-8c83-e011c8d67092	1ad14a3d-0f96-411e-a103-a0ec4dafe480	643f6b82-ef57-41fe-8049-8588069c0b83	LIKE	2025-12-08 08:15:20.166
6b516cdf-9da7-4cff-94d6-97367015fb08	ae59a5c3-cd8a-4a6d-8481-e7a56bc62151	643f6b82-ef57-41fe-8049-8588069c0b83	LIKE	2025-12-15 08:15:20.168
12735ed4-29aa-4871-9812-7e311a07d25c	8a1e0004-0a71-42b7-89ef-71bad6479a9e	643f6b82-ef57-41fe-8049-8588069c0b83	LOVE	2026-01-15 08:15:20.169
6f096a2c-7b9f-42f6-9f54-7e0b867abe09	bcf553c4-58ee-410f-a74d-d5d9370b0dde	643f6b82-ef57-41fe-8049-8588069c0b83	LIKE	2025-12-31 08:15:20.172
ca255bd9-7dfb-4817-b689-5e3350b6a477	cdfff534-6c77-4db1-a2f2-faa601ad48eb	643f6b82-ef57-41fe-8049-8588069c0b83	LIKE	2025-12-31 08:15:20.173
9e0ebf16-281d-47db-9c95-6bf09136da8a	1475b0c5-e395-42d2-ba08-03b68d7a233c	643f6b82-ef57-41fe-8049-8588069c0b83	LOVE	2025-12-18 08:15:20.175
f16ec2f4-f404-4b08-86fb-ca1aaf6f5090	2f8e040e-fdce-4d63-908b-7d290e6c7ed1	643f6b82-ef57-41fe-8049-8588069c0b83	LIKE	2025-12-13 08:15:20.177
f49c5056-57e1-4e19-a9f5-57a13568a05c	27a7b508-cfef-4e86-a91c-1cbb6ef7d556	643f6b82-ef57-41fe-8049-8588069c0b83	LIKE	2026-01-11 08:15:20.179
e65654df-0e12-45a0-8c4e-5f649ad60631	917efd28-bbfe-4c3f-bf93-4af3e5c2c31e	643f6b82-ef57-41fe-8049-8588069c0b83	LIKE	2025-12-15 08:15:20.182
f2135d7c-bcd5-44d6-9748-c21a8f3ce7c2	939a0a06-1e1a-4cb8-a6b3-6737f38d264b	1ba6deb2-7dca-488c-a6ca-33e0bc33d354	LIKE	2026-01-21 08:15:20.184
914db835-ceda-47ff-a241-ac87d62de1a7	238b9dac-2644-427e-8bd2-ed4c3abb8890	1ba6deb2-7dca-488c-a6ca-33e0bc33d354	LIKE	2026-01-23 08:15:20.186
a29475ac-5cd5-4bd6-aab1-475f75362613	2f1ccf7a-022a-4f35-befc-7b401c50aa38	1ba6deb2-7dca-488c-a6ca-33e0bc33d354	LIKE	2025-12-17 08:15:20.188
be6238b2-d8a8-4e7b-9b31-528ac92bd332	9f8dd3c6-3a70-4541-94a6-a4ea9ce5c5ce	1ba6deb2-7dca-488c-a6ca-33e0bc33d354	LIKE	2026-01-02 08:15:20.189
6de6eb23-0365-417e-8077-d9a6d0c2924f	cf7c11a7-a38d-4241-81ff-180548d5f270	1ba6deb2-7dca-488c-a6ca-33e0bc33d354	LOVE	2026-01-17 08:15:20.191
e55163c9-f5ed-4108-954c-f4314f31b55a	595089e5-b503-471f-8bbb-50910e96a191	1ba6deb2-7dca-488c-a6ca-33e0bc33d354	LIKE	2026-01-15 08:15:20.193
bb0c3af4-a435-444a-bf05-2beb4a01c2ab	50b2fd75-14de-406c-9db1-e61588b96068	1ba6deb2-7dca-488c-a6ca-33e0bc33d354	LIKE	2026-01-23 08:15:20.194
8aeceac3-5e1a-4a7f-815b-f3e1d79c9981	f175b7f6-7867-45ed-ab09-0fe265040bcf	1ba6deb2-7dca-488c-a6ca-33e0bc33d354	LIKE	2025-12-31 08:15:20.196
144828d3-ff85-468b-a167-b32f6e7e8347	91fb42f5-a87c-4ec0-97bd-2ca1fc3eff88	1ba6deb2-7dca-488c-a6ca-33e0bc33d354	LIKE	2026-01-01 08:15:20.198
c5e5a9ba-fef4-4196-8e9e-c3dea16753c1	d0deb68d-283f-465f-9c10-211a4742a34e	1ba6deb2-7dca-488c-a6ca-33e0bc33d354	LIKE	2025-12-29 08:15:20.2
79b84f6a-4ee9-4e45-8436-a8322b2ca3fe	9f8dd3c6-3a70-4541-94a6-a4ea9ce5c5ce	6ea31b6f-ac71-4780-9576-9abbcb403542	LIKE	2025-12-08 08:15:20.202
8905b026-6c22-4449-bc6a-23447e0b2b98	48187149-2343-4ede-9d45-9ec29279dfd2	6ea31b6f-ac71-4780-9576-9abbcb403542	LIKE	2025-12-16 08:15:20.204
d3908735-240c-4ec9-9aa1-f8393ed0d131	38c839cc-f81a-4998-8afa-aaf4ba466248	6ea31b6f-ac71-4780-9576-9abbcb403542	LOVE	2026-01-28 08:15:20.206
ab4869d4-5839-41ea-a3c9-0948b69031fc	8a1e0004-0a71-42b7-89ef-71bad6479a9e	6ea31b6f-ac71-4780-9576-9abbcb403542	LOVE	2026-01-01 08:15:20.207
c2d4313c-1568-4813-8c5c-cf454a3a7b7d	ea32ea39-a33f-49cc-af13-04804ae4dfa0	6ea31b6f-ac71-4780-9576-9abbcb403542	LIKE	2026-01-18 08:15:20.21
9f90b3fc-f1df-45fb-b4c0-a1756b497f82	ce7ce853-42a6-4b2c-b1ac-3f657dcbbf6b	6ea31b6f-ac71-4780-9576-9abbcb403542	LIKE	2025-12-29 08:15:20.212
cd8322ab-7fb7-4d37-8f74-571cfc496fd4	1475b0c5-e395-42d2-ba08-03b68d7a233c	6ea31b6f-ac71-4780-9576-9abbcb403542	LIKE	2026-01-01 08:15:20.215
dab89211-8dbb-4fda-84e1-d42122f23707	40540771-bd01-477e-9bd9-1a97e9791fd1	90254005-32ef-4413-a61d-3becac6543a7	LIKE	2025-12-06 08:15:20.217
067c7e32-4ae5-4c3d-8314-81192f40623f	f2d3c142-53b9-4641-9682-90b34edd5154	90254005-32ef-4413-a61d-3becac6543a7	LIKE	2025-12-26 08:15:20.22
c9e8f1fa-1d7b-4121-a10f-82742fc6ac76	184e24f5-5cb4-4cc0-b562-addee57f91cc	90254005-32ef-4413-a61d-3becac6543a7	LIKE	2025-12-07 08:15:20.222
528f92a2-0502-41e9-b9c9-3c104326b887	b6afb299-43be-4bc6-86ee-434584f5f0a2	90254005-32ef-4413-a61d-3becac6543a7	LIKE	2025-12-23 08:15:20.224
fe3d5b4b-405d-4df4-80a3-47807dc71183	6e69e1f1-2d77-49da-bc84-62f12a401fdb	90254005-32ef-4413-a61d-3becac6543a7	LIKE	2026-01-02 08:15:20.226
a9f66ff7-81db-417c-9a1e-bbecf18cf86b	6612a331-2296-4356-9611-a2c836fadf7e	90254005-32ef-4413-a61d-3becac6543a7	LIKE	2026-01-12 08:15:20.228
8a556905-ac87-4833-8070-9549c6015b74	6f2a0c6d-6e90-4cd6-8774-abd9c722c6b4	90254005-32ef-4413-a61d-3becac6543a7	LIKE	2025-12-10 08:15:20.23
fcfe7658-b08a-453d-b037-ee5dd74ff06c	444cd236-b686-4c61-87c9-2a9e87933d7b	90254005-32ef-4413-a61d-3becac6543a7	LIKE	2026-01-06 08:15:20.232
b5050077-4af7-4b2e-a322-2e4231c06002	4338aa7b-9826-4c1f-8cf5-7d0a5331d4a2	90254005-32ef-4413-a61d-3becac6543a7	LIKE	2026-01-25 08:15:20.234
64733692-a550-419f-8b51-c0592b9dc97a	1ad14a3d-0f96-411e-a103-a0ec4dafe480	90254005-32ef-4413-a61d-3becac6543a7	LIKE	2026-01-15 08:15:20.235
35ed6cb3-aa9d-47ad-995b-6f6d33af1706	939a0a06-1e1a-4cb8-a6b3-6737f38d264b	90254005-32ef-4413-a61d-3becac6543a7	LOVE	2025-12-06 08:15:20.237
0812eba8-9999-4cdc-a0ce-b34b59d51df9	312d7038-0402-4693-8c0e-5c7fedf8519f	90254005-32ef-4413-a61d-3becac6543a7	LIKE	2026-01-29 08:15:20.238
d97933a5-70e7-4358-aeb2-5e851e9f9689	e9239df4-f49b-4f39-b349-252180ecf387	90254005-32ef-4413-a61d-3becac6543a7	LIKE	2025-12-30 08:15:20.24
4dcb3041-884e-450b-b836-62805e5561db	eb7f7b5a-e424-4faa-87ba-ff4d35c81cc4	90254005-32ef-4413-a61d-3becac6543a7	LIKE	2026-01-10 08:15:20.242
1de09a65-82ea-4ad6-8645-84ac53d0f309	38c839cc-f81a-4998-8afa-aaf4ba466248	90254005-32ef-4413-a61d-3becac6543a7	LIKE	2026-01-04 08:15:20.245
ba3448ca-b40d-4ae7-af03-fd3dc38d57c3	0587db93-4151-4825-8cbf-d96e5893212b	90254005-32ef-4413-a61d-3becac6543a7	LIKE	2026-01-21 08:15:20.246
ca23cda2-2b09-49ae-a893-8fb3ab92e27e	b2e33f04-354c-4b61-9db1-72d4cb2bf07c	90254005-32ef-4413-a61d-3becac6543a7	LIKE	2025-12-26 08:15:20.249
d92c4706-8989-43f1-b547-21d076622cdc	8a1e0004-0a71-42b7-89ef-71bad6479a9e	90254005-32ef-4413-a61d-3becac6543a7	LIKE	2026-01-05 08:15:20.251
1e665f84-bab1-4fd3-95ce-269a7c232a21	595089e5-b503-471f-8bbb-50910e96a191	da4b6c7f-bb64-4b5e-90f3-dac610ac6ba5	LIKE	2026-01-19 08:15:20.252
3b7498cf-fd89-4517-bc4f-8f93764d4292	5a41b008-7743-477d-b69a-f24cd12d0ef8	da4b6c7f-bb64-4b5e-90f3-dac610ac6ba5	LIKE	2025-12-24 08:15:20.255
8988c3b3-a747-45cd-9c49-97e338b157ea	f72c60c1-cba6-4b45-b182-49b3b4a3e651	da4b6c7f-bb64-4b5e-90f3-dac610ac6ba5	LIKE	2026-01-27 08:15:20.257
331f6cfa-ef48-4086-9ced-69b351481671	312d7038-0402-4693-8c0e-5c7fedf8519f	da4b6c7f-bb64-4b5e-90f3-dac610ac6ba5	LOVE	2026-01-11 08:15:20.258
fefca295-e70b-43b1-a0d0-ebd26b507fa9	07c79298-6724-4826-934c-0c0693e8f51a	da4b6c7f-bb64-4b5e-90f3-dac610ac6ba5	LIKE	2026-01-10 08:15:20.26
46767637-2dbc-44d1-a4be-da854635c52d	eb7f7b5a-e424-4faa-87ba-ff4d35c81cc4	da4b6c7f-bb64-4b5e-90f3-dac610ac6ba5	LIKE	2026-01-19 08:15:20.262
f89f1223-e39d-457e-8990-f2b5db5720c0	9f8dd3c6-3a70-4541-94a6-a4ea9ce5c5ce	da4b6c7f-bb64-4b5e-90f3-dac610ac6ba5	LIKE	2026-01-07 08:15:20.264
cf950778-9e7f-4504-a139-5fd7931b663f	50b2fd75-14de-406c-9db1-e61588b96068	da4b6c7f-bb64-4b5e-90f3-dac610ac6ba5	LIKE	2026-01-27 08:15:20.266
c7b9405c-da52-4b7d-9a7f-973557c0ebc6	40540771-bd01-477e-9bd9-1a97e9791fd1	da4b6c7f-bb64-4b5e-90f3-dac610ac6ba5	LIKE	2026-01-12 08:15:20.269
3a40fa4a-8235-4f01-bf22-9566536584db	27a7b508-cfef-4e86-a91c-1cbb6ef7d556	da4b6c7f-bb64-4b5e-90f3-dac610ac6ba5	LIKE	2025-12-25 08:15:20.271
84afca66-a176-4ebf-8a0a-0d6caadd59dc	03022b17-5967-486d-818e-85a2b71056d5	da4b6c7f-bb64-4b5e-90f3-dac610ac6ba5	LIKE	2026-01-25 08:15:20.272
1ed09d59-787d-4618-ae11-4b0695f95ff8	4b1c2adf-90d0-48e2-a40e-3950a4ce2a83	da4b6c7f-bb64-4b5e-90f3-dac610ac6ba5	LIKE	2026-01-17 08:15:20.275
4fa8f6e1-a3c3-45f2-88ed-d4b0493f078e	444cd236-b686-4c61-87c9-2a9e87933d7b	da4b6c7f-bb64-4b5e-90f3-dac610ac6ba5	LIKE	2025-12-06 08:15:20.277
b7159c9d-82f9-4fde-ac75-760d0a6cd5df	5cb29817-5c04-48e7-9559-4cfb26318863	da4b6c7f-bb64-4b5e-90f3-dac610ac6ba5	LIKE	2025-12-22 08:15:20.279
01d77c49-ba38-4dd8-9630-160c36c4d408	b38028d8-8c4a-4c0d-8759-a79b6ed93fc1	da4b6c7f-bb64-4b5e-90f3-dac610ac6ba5	LIKE	2026-01-04 08:15:20.281
7a6f5959-0614-4889-abd1-5337ef37d510	5a8e03d7-2b9b-4330-b28a-a64d9ea31629	da4b6c7f-bb64-4b5e-90f3-dac610ac6ba5	LIKE	2026-01-09 08:15:20.283
0a5dbdeb-0d9b-4eca-9426-481cf432adcf	5120f1c6-507e-4a5b-aa9f-53241f3a2b9b	da4b6c7f-bb64-4b5e-90f3-dac610ac6ba5	LIKE	2026-01-12 08:15:20.285
68dee2c5-0489-4201-8ad7-c2f7f5661557	71acdd69-48cd-4740-80d8-962b70085449	da4b6c7f-bb64-4b5e-90f3-dac610ac6ba5	LIKE	2025-12-28 08:15:20.287
9ee4abac-d690-4d38-86dd-02606058a498	f3642b14-2e93-44f2-84fc-db0ed83b404f	da4b6c7f-bb64-4b5e-90f3-dac610ac6ba5	LIKE	2026-01-14 08:15:20.289
88b13603-2d48-4673-8f3a-1731e326c912	71acdd69-48cd-4740-80d8-962b70085449	3d101b84-ccd2-4315-8b10-d557642de808	LIKE	2026-01-18 08:15:20.291
3f53b50d-36d8-4874-8c4f-f7ea7197916f	6f2a0c6d-6e90-4cd6-8774-abd9c722c6b4	3d101b84-ccd2-4315-8b10-d557642de808	LIKE	2025-12-19 08:15:20.293
c65ba7d2-a745-4cfb-8a59-13889b75dca1	6e69e1f1-2d77-49da-bc84-62f12a401fdb	3d101b84-ccd2-4315-8b10-d557642de808	LIKE	2026-01-16 08:15:20.294
2583c7de-68f6-42e4-a828-7361ae008b4d	4338aa7b-9826-4c1f-8cf5-7d0a5331d4a2	3d101b84-ccd2-4315-8b10-d557642de808	LIKE	2026-01-29 08:15:20.3
a4e5df2e-cf11-4a62-8a2f-f64e43663ebe	03022b17-5967-486d-818e-85a2b71056d5	3d101b84-ccd2-4315-8b10-d557642de808	LIKE	2026-01-21 08:15:20.303
cae1db53-9392-4bf1-a44a-11d653649840	484180d6-851b-461b-9995-07d3e3fb0116	3d101b84-ccd2-4315-8b10-d557642de808	LIKE	2025-12-13 08:15:20.305
46c00860-77c0-46b9-9ce6-111cc4059672	dcbd21e4-2164-4f08-b560-e3e06c906b12	3d101b84-ccd2-4315-8b10-d557642de808	LOVE	2025-12-28 08:15:20.307
cc2fa6d2-a9b9-4aab-8419-f3c804fb7348	07c79298-6724-4826-934c-0c0693e8f51a	3d101b84-ccd2-4315-8b10-d557642de808	LIKE	2026-01-09 08:15:20.309
8730fcec-773e-41fe-86a9-abfec36dc311	40540771-bd01-477e-9bd9-1a97e9791fd1	3d101b84-ccd2-4315-8b10-d557642de808	LIKE	2026-01-21 08:15:20.311
e3cd8469-03c1-4e7c-9267-44e95dc7d34e	92472c64-e07d-4692-b1a5-618eec89121a	ce028d91-13de-4100-b187-6b9b3a87e9a9	LIKE	2025-12-04 08:15:20.314
62dc6a90-edf5-4144-9a16-2009cd64fb78	a7b7f687-3168-4b5b-b01c-acfef742da8a	ce028d91-13de-4100-b187-6b9b3a87e9a9	LOVE	2026-01-24 08:15:20.316
45694f8c-b1d0-4a5e-8783-0202c2182d01	66e331b4-7b4b-42a6-b0be-532332292f1b	ce028d91-13de-4100-b187-6b9b3a87e9a9	LIKE	2026-01-26 08:15:20.318
cfd9f35f-f092-4545-afa7-cb5d779db2ff	7bbf08be-8791-4b49-9452-3200a0b22b87	ce028d91-13de-4100-b187-6b9b3a87e9a9	LIKE	2026-01-19 08:15:20.32
f66bb6bf-7913-4a23-b0c6-dea6bedeeea3	b2e33f04-354c-4b61-9db1-72d4cb2bf07c	ce028d91-13de-4100-b187-6b9b3a87e9a9	LIKE	2026-01-11 08:15:20.321
add57e99-2a9e-4278-8e43-b85514412548	eb7f7b5a-e424-4faa-87ba-ff4d35c81cc4	ce028d91-13de-4100-b187-6b9b3a87e9a9	LIKE	2025-12-29 08:15:20.324
49e77c61-1da1-44d5-8bb5-0c07e6a69ba5	90166457-241e-46a6-bd4b-1a19d8bfe12a	ce028d91-13de-4100-b187-6b9b3a87e9a9	LIKE	2025-12-17 08:15:20.326
4e12debe-9a33-4637-bf30-70f033c50f0b	84fa5ae9-2b10-4102-83b0-391accda9aba	ce028d91-13de-4100-b187-6b9b3a87e9a9	LIKE	2025-12-03 08:15:20.327
27bd5f59-ae9a-4d75-9519-18c5b4130f81	deaa1ab2-4d52-4cb4-a36b-fcc583b99992	ce028d91-13de-4100-b187-6b9b3a87e9a9	LIKE	2025-12-22 08:15:20.329
473e768f-2a60-4e2a-a7e9-edfc68797bb1	5cb29817-5c04-48e7-9559-4cfb26318863	ce028d91-13de-4100-b187-6b9b3a87e9a9	LIKE	2025-12-16 08:15:20.331
9362c66c-bfa0-4c95-9166-f7b26da26d93	2f8e040e-fdce-4d63-908b-7d290e6c7ed1	ce028d91-13de-4100-b187-6b9b3a87e9a9	LIKE	2026-01-04 08:15:20.333
afddde26-8b57-448c-85e7-6b7343974e3b	6f2a0c6d-6e90-4cd6-8774-abd9c722c6b4	ce028d91-13de-4100-b187-6b9b3a87e9a9	LIKE	2025-12-17 08:15:20.334
3d35c79f-9383-49b2-a117-8157a54c146c	5120f1c6-507e-4a5b-aa9f-53241f3a2b9b	ce028d91-13de-4100-b187-6b9b3a87e9a9	LIKE	2025-12-24 08:15:20.336
cd73eda4-1641-4426-9190-c93f881b3493	67475aa3-0f09-47e2-8f7a-4e7fa35a94fb	ce028d91-13de-4100-b187-6b9b3a87e9a9	LIKE	2026-01-24 08:15:20.338
9632367f-1540-447c-9bd8-896eacac612f	917efd28-bbfe-4c3f-bf93-4af3e5c2c31e	ce028d91-13de-4100-b187-6b9b3a87e9a9	LIKE	2026-01-18 08:15:20.34
9f196a0c-9105-4bee-b770-6c4dae8c067b	9f8dd3c6-3a70-4541-94a6-a4ea9ce5c5ce	ce028d91-13de-4100-b187-6b9b3a87e9a9	LIKE	2026-01-18 08:15:20.342
a5207b86-ecdb-4cbd-9b11-46ed532d7170	d279d4a9-1412-4a74-a40b-44954082a13c	ce028d91-13de-4100-b187-6b9b3a87e9a9	LIKE	2026-01-15 08:15:20.344
88295247-eea6-4ee5-9b6e-6b009230b653	f72c60c1-cba6-4b45-b182-49b3b4a3e651	82009565-7b4c-460f-b3d4-e3c6641d3a3d	LIKE	2026-01-13 08:15:20.346
dbb49d3b-86e8-4396-b919-f0f28423acce	7bbf08be-8791-4b49-9452-3200a0b22b87	82009565-7b4c-460f-b3d4-e3c6641d3a3d	LIKE	2026-01-09 08:15:20.348
cc4b8f98-2dd2-43d9-99f9-6849b8c41815	f3642b14-2e93-44f2-84fc-db0ed83b404f	82009565-7b4c-460f-b3d4-e3c6641d3a3d	LIKE	2025-12-31 08:15:20.349
56cdbb8b-e3c1-4797-a41b-24329dae6fbf	5a8e03d7-2b9b-4330-b28a-a64d9ea31629	82009565-7b4c-460f-b3d4-e3c6641d3a3d	LIKE	2026-01-11 08:15:20.351
51b1ea32-a523-449b-94a1-f4324c106b7f	3909ff1e-c321-480c-95e1-0176ffe923bb	82009565-7b4c-460f-b3d4-e3c6641d3a3d	LIKE	2025-12-30 08:15:20.353
28a95b49-c0e9-421f-b8d8-6ed81e823273	5120f1c6-507e-4a5b-aa9f-53241f3a2b9b	82009565-7b4c-460f-b3d4-e3c6641d3a3d	LIKE	2026-01-01 08:15:20.355
101614bd-42af-474d-aabf-2b367203065e	a7b7f687-3168-4b5b-b01c-acfef742da8a	82009565-7b4c-460f-b3d4-e3c6641d3a3d	LIKE	2025-12-10 08:15:20.357
27e3bc7c-bc26-4704-85e1-f9d196ec6634	d0deb68d-283f-465f-9c10-211a4742a34e	82009565-7b4c-460f-b3d4-e3c6641d3a3d	LIKE	2025-12-11 08:15:20.359
f1738974-7988-4cc5-8085-e35cdfec9fa4	444cd236-b686-4c61-87c9-2a9e87933d7b	82009565-7b4c-460f-b3d4-e3c6641d3a3d	LIKE	2025-12-10 08:15:20.36
89ca6761-dd57-4f15-83c2-aac1381d6792	f2d3c142-53b9-4641-9682-90b34edd5154	82009565-7b4c-460f-b3d4-e3c6641d3a3d	LOVE	2026-01-07 08:15:20.363
c8c28628-e698-4feb-87e0-7c6b284abbeb	33d891e5-c4e9-4caa-bd27-f66e6cfb37a3	82009565-7b4c-460f-b3d4-e3c6641d3a3d	LIKE	2026-01-27 08:15:20.365
98b534cd-346d-4ddf-bb35-fcf395f08245	03022b17-5967-486d-818e-85a2b71056d5	82009565-7b4c-460f-b3d4-e3c6641d3a3d	LIKE	2025-12-25 08:15:20.368
00538e33-bb62-4953-8625-0a811f4bd547	62c61c87-6e44-4d1e-b891-5a637c989a03	82009565-7b4c-460f-b3d4-e3c6641d3a3d	LIKE	2026-01-01 08:15:20.37
6a734d3f-cd5c-44b5-8270-e3dae7874640	66e331b4-7b4b-42a6-b0be-532332292f1b	82009565-7b4c-460f-b3d4-e3c6641d3a3d	LIKE	2026-01-03 08:15:20.373
27471da7-2f2c-477a-800e-068c4f372763	4122c870-8a2d-4191-a4aa-fbf19fdaac1a	a3584a76-73bd-435b-9d44-663ce753b456	LIKE	2025-12-20 08:15:20.375
d84837ca-7be8-4242-98f7-62eda8112fe9	38c839cc-f81a-4998-8afa-aaf4ba466248	a3584a76-73bd-435b-9d44-663ce753b456	LIKE	2026-01-02 08:15:20.378
8ed27299-d33b-4645-851c-7dff7f886e8a	72939137-da8b-456c-834b-2a9753bbe1ba	a3584a76-73bd-435b-9d44-663ce753b456	LIKE	2025-12-31 08:15:20.381
b9a87c9b-64ba-40b9-9a3e-d36db8a3ee72	cdfff534-6c77-4db1-a2f2-faa601ad48eb	a3584a76-73bd-435b-9d44-663ce753b456	LIKE	2026-01-24 08:15:20.383
32d2c39f-1920-4153-93c4-ba155d03c18f	15aec74c-1343-4c15-a58d-887b6a06b1f3	a3584a76-73bd-435b-9d44-663ce753b456	LIKE	2026-01-19 08:15:20.384
2431031b-77a3-4681-9de0-0f77b75219bc	ea32ea39-a33f-49cc-af13-04804ae4dfa0	a3584a76-73bd-435b-9d44-663ce753b456	LIKE	2025-12-02 08:15:20.386
157da791-1c44-47f5-babe-7001c313e22b	07c79298-6724-4826-934c-0c0693e8f51a	a3584a76-73bd-435b-9d44-663ce753b456	LIKE	2026-01-06 08:15:20.388
278a097d-c028-4e95-bfce-258feb61b2d5	7bbf08be-8791-4b49-9452-3200a0b22b87	a3584a76-73bd-435b-9d44-663ce753b456	LIKE	2026-01-23 08:15:20.39
bc0d0ca7-d45d-4bc2-99ca-50fcc8202b30	55ba721f-044e-4dd1-94a5-3de7dedd3bae	a3584a76-73bd-435b-9d44-663ce753b456	LIKE	2025-12-07 08:15:20.392
c1072742-2f47-4167-a525-5904ab81a5e8	deaa1ab2-4d52-4cb4-a36b-fcc583b99992	a3584a76-73bd-435b-9d44-663ce753b456	LIKE	2026-01-10 08:15:20.394
a915e07a-ea8f-48cf-83fd-71315b4d55f6	6f2a0c6d-6e90-4cd6-8774-abd9c722c6b4	a3584a76-73bd-435b-9d44-663ce753b456	LIKE	2025-12-13 08:15:20.396
1c974f84-af3c-463d-aba3-25a26b68f007	444cd236-b686-4c61-87c9-2a9e87933d7b	2881ab0e-6ec3-46f5-9627-46024b754a99	LIKE	2026-01-02 08:15:20.397
3679a90e-cb39-4fa0-b416-977f8754cfcc	72939137-da8b-456c-834b-2a9753bbe1ba	2881ab0e-6ec3-46f5-9627-46024b754a99	LIKE	2025-12-31 08:15:20.399
6ece5c96-a6d3-41d7-8b3c-c4fcb384a1df	312d7038-0402-4693-8c0e-5c7fedf8519f	2881ab0e-6ec3-46f5-9627-46024b754a99	LIKE	2026-01-03 08:15:20.401
91f528a1-ff66-4f91-a3a0-3bb2a04801a8	f175b7f6-7867-45ed-ab09-0fe265040bcf	2881ab0e-6ec3-46f5-9627-46024b754a99	LIKE	2026-01-05 08:15:20.403
2745ead2-5d28-4330-90b5-d4a0f56fae81	40540771-bd01-477e-9bd9-1a97e9791fd1	2881ab0e-6ec3-46f5-9627-46024b754a99	LOVE	2025-12-12 08:15:20.404
6b020605-614f-49ec-97db-b8e12e10c69f	71acdd69-48cd-4740-80d8-962b70085449	2881ab0e-6ec3-46f5-9627-46024b754a99	LOVE	2026-01-05 08:15:20.406
ed9dc496-da90-4682-9338-36583bbb3b07	03022b17-5967-486d-818e-85a2b71056d5	2881ab0e-6ec3-46f5-9627-46024b754a99	LIKE	2025-12-31 08:15:20.409
27fde169-d829-4052-961f-a718ee08e6f9	b96b833c-b88d-40f6-80df-146bdd457983	2881ab0e-6ec3-46f5-9627-46024b754a99	LIKE	2026-01-13 08:15:20.411
8fa48be0-097f-4576-b256-f8a28fa933ac	5086d4a7-519a-4496-9938-ee343f38861f	183e97e4-143e-4ee2-b3f5-7882d4ff1ad7	LIKE	2026-02-15 14:59:40.953462
c6d97255-fecb-4aad-a7ec-ed4516031eaf	5086d4a7-519a-4496-9938-ee343f38861f	de3bc42b-0c3a-4b0b-bdfd-7940b721c420	LIKE	2026-03-01 02:26:35.391685
4da65f9e-9517-44a2-92ba-5334867d8313	5086d4a7-519a-4496-9938-ee343f38861f	dc82f92a-bf51-4b9f-9402-668ab7c06af1	LIKE	2026-02-15 15:16:11.312582
091fe7df-53f6-4e5d-bab2-8f48faceba46	5086d4a7-519a-4496-9938-ee343f38861f	3d101b84-ccd2-4315-8b10-d557642de808	LIKE	2026-02-15 15:33:15.383173
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_tokens (id, "tokenHash", "expiresAt", "createdAt", "userId") FROM stdin;
9d866c2e-e6b4-4e10-9bfb-e2b49813ed0e	$2b$10$q9MnJiGevuxSn4nmg.KWsOtH87cMBxPe1M5KeUQdGv6ZZCLifkg1a	2026-03-13 09:38:14.956	2026-02-11 13:38:14.972647	5086d4a7-519a-4496-9938-ee343f38861f
5c908c1c-7519-4015-892d-efe9db1d31ff	$2b$10$w063YtHCKRdjoLOMQ.D56OAgOubd9i9Prw1co4ZYnEUr2yBTxsObS	2026-03-13 09:44:29.369	2026-02-11 13:44:29.379095	5086d4a7-519a-4496-9938-ee343f38861f
1d667c44-8b51-4fb7-b6d6-5536b56932c1	$2b$10$rgGiB402bzMr78ATcH3GVe/BJcBIFOijANfBmA6GtdLst5KZRiJRe	2026-03-13 09:56:55.144	2026-02-11 13:56:55.148555	5086d4a7-519a-4496-9938-ee343f38861f
a9192267-7076-4089-84af-9c717181a4f0	$2b$10$p.ODvv6Zhlbc1JrBA.uJ3O.r23stuTn9fYObEqmfsk1r6vB0TJjzi	2026-03-13 09:57:41.938	2026-02-11 13:57:41.941733	5086d4a7-519a-4496-9938-ee343f38861f
e6216ad5-77c3-4acc-ad38-ad09f249171f	$2b$10$3k/AWLX1UJ3y1XtszM7zNuaYBv.BdZeL2Bs.eWSlY5zLbzUuWKxhe	2026-03-13 10:00:56.539	2026-02-11 14:00:56.541277	5086d4a7-519a-4496-9938-ee343f38861f
aa6e0804-f8c5-4f1b-b3fc-b43d6b2efcad	$2b$10$CiNQyxXPeLdYhaEH.kLIJeAmvt92jYPbdS6bCQS5IrZtGuvIHgM9C	2026-03-13 11:43:03.447	2026-02-11 15:43:03.454765	5086d4a7-519a-4496-9938-ee343f38861f
79e1c785-2b89-4b4d-a27e-f3184c0c1473	$2b$10$Q978DzbAmTVKOY6Ot6720u1B6Ly4J5Wgp3g.4ttDLjMTJ1zinJW3m	2026-03-13 11:43:43.457	2026-02-11 15:43:43.460964	5086d4a7-519a-4496-9938-ee343f38861f
99abec23-2e06-43ba-9485-837bc6a0d0df	$2b$10$Sq9RTzIvizuh5JvyPK5/J.5tUzlapveDwNOW0tTy0f8Zd4RK/1XCa	2026-03-13 11:48:35.211	2026-02-11 15:48:35.215823	5086d4a7-519a-4496-9938-ee343f38861f
fd26f62c-3408-481e-b142-70ac93ed0699	$2b$10$MLaFuSTxD1SYrGWySRQKBOvHVfO0aebj9uRCVSwpXHzoo1NZ6KDEG	2026-03-13 11:51:39.477	2026-02-11 15:51:39.48125	5086d4a7-519a-4496-9938-ee343f38861f
3e624f54-afcb-45ca-a26d-afee3f36bdbd	$2b$10$vKXWjFELD.GLY5nkWDCteerDxrdLziA3IJVtUoxoOkpcVybt.O6ei	2026-03-13 11:51:55.272	2026-02-11 15:51:55.275188	5086d4a7-519a-4496-9938-ee343f38861f
df88a1c7-4774-4f60-9c8e-1bbb1b8531dd	$2b$10$P/ISnC8uVWjcCqQXRBqMUOdjyf64sco.QdNoOR4L0SUHmO15QSCeG	2026-03-13 11:52:36.636	2026-02-11 15:52:36.639064	5086d4a7-519a-4496-9938-ee343f38861f
0f4de987-b6ec-4dc4-925d-3d3f851125c5	$2b$10$Scjs2naBSgmmVFOpvxHoLuKVQvxBsl5m0NfuhaDM.9eZBBstyZmve	2026-03-13 12:00:14.223	2026-02-11 16:00:14.226309	5086d4a7-519a-4496-9938-ee343f38861f
60bb11ee-ff0d-40df-b8ec-59ea9b75ca2d	$2b$10$n2WQP8c718hmSqiDLzt3Geyir8NpThXcpTnHh3zKXV0VWtYMFxgqi	2026-03-13 12:01:11.465	2026-02-11 16:01:11.468959	5086d4a7-519a-4496-9938-ee343f38861f
1119cd10-78e3-456b-a21e-7b34abe0f586	$2b$10$5jJHNbInCz2IOaj84iUV5.DxBcIMfRE60K2yTGFqemx9DawHEVDhW	2026-03-13 12:42:15.453	2026-02-11 16:42:15.461362	5086d4a7-519a-4496-9938-ee343f38861f
d4241fda-54eb-4242-9ed1-75e6adaabadc	$2b$10$kJXUV.KGRSrqKlnyAadEsOJMpNs6pNDW8pPdu0IgI4gM6360SEHyW	2026-03-13 12:42:33.821	2026-02-11 16:42:33.824125	5086d4a7-519a-4496-9938-ee343f38861f
4a58f2dd-c764-47d3-930e-6b2a0e9b71b8	$2b$10$XEgLjHYetFw2q4ytBbcSneQ3z8srnlsZMwmWtAFBvtiO1iJnTghe.	2026-03-13 13:04:20.408	2026-02-11 17:04:20.411491	5086d4a7-519a-4496-9938-ee343f38861f
32008d3f-0641-4beb-a9d7-27cb63234d74	$2b$10$lbxM6dCPbubwW3OgWPZ9w.qoMpOpdAV/E9wIN43bxFF9SCCXcr2Ze	2026-03-15 16:31:41.068	2026-02-13 20:31:41.071956	5086d4a7-519a-4496-9938-ee343f38861f
79f1e3da-840a-4cdb-bb9b-0ffb8f62cab1	$2b$10$ohcSyMF3JJi6h.nqtkNaAOqlI19GAK7or4UCsZUO6Yhi64SOazBuO	2026-03-15 16:49:33.411	2026-02-13 20:49:33.418554	5086d4a7-519a-4496-9938-ee343f38861f
e79c2058-07bd-4f4a-9a0c-4f40660ac15d	$2b$10$o1eGXPPT1tfJlS/1q5EuNOxFqojsx/69Cqsuy3MuzkI1EmURJDQs2	2026-03-15 17:47:16.779	2026-02-13 21:47:16.786171	5086d4a7-519a-4496-9938-ee343f38861f
2bf24e38-0c98-4c3f-9db2-a8c77fe2a17c	$2b$10$7FQW9C0uRBpzj7V0rD1tpu4ZCWatgTJHkGfeH7poQ8N7km3adW3.m	2026-03-15 17:56:54.019	2026-02-13 21:56:54.025168	5086d4a7-519a-4496-9938-ee343f38861f
53367816-d6a0-48a3-a276-9efa06e454f9	$2b$10$K8BP.3wCOMvnj86wkC.X5.WiqgxEYYhY2ELaKRZORhIC6DlpDRhjS	2026-03-15 18:08:17.512	2026-02-13 22:08:17.517778	5086d4a7-519a-4496-9938-ee343f38861f
c5c37266-c3e7-4d14-b21f-aae36f7318bd	$2b$10$xJWWYQqXREXDrP.Ccj3gyu1jcbQQR2Ctin8CT.P5szP1LdJ.kvdRe	2026-03-16 01:47:30.619	2026-02-14 05:47:30.62886	5086d4a7-519a-4496-9938-ee343f38861f
ea3ea79d-80e9-4cdf-aee3-7f00dff10198	$2b$10$T7xnH86yi.mHYwFWgPm47uUC2LdJuuGujpUK5FijxA44SsLTvDk7y	2026-03-17 10:48:44.783	2026-02-15 14:48:44.796221	5086d4a7-519a-4496-9938-ee343f38861f
dead28ef-9e29-40af-95cf-1b10947695ed	$2b$10$ENJs4uflSEAnX4dkJvwqMukxOTuJLo6bi6es6AFs1jH73fMsYUIv2	2026-03-17 11:08:25.771	2026-02-15 15:08:25.775131	5086d4a7-519a-4496-9938-ee343f38861f
92e966f3-e3ca-4c5c-a713-ca7ef1016e53	$2b$10$rlMhy4I49GGP8NomH6bDoecdwVx.jyqfIIlOp2N8SPaTVnLz9c2wi	2026-03-17 11:33:02.722	2026-02-15 15:33:02.729575	5086d4a7-519a-4496-9938-ee343f38861f
2ea4af7a-0e0b-4cb5-ae7a-dfb522cf9833	$2b$10$QLluf9HOc3ZC2mN/CXa.2.e7kVM4wnCkGqTiQ63M5IbCh1Ab/.9R.	2026-03-17 11:50:43.434	2026-02-15 15:50:43.441379	5086d4a7-519a-4496-9938-ee343f38861f
1316670c-315b-4e56-a745-b1e2970b07aa	$2b$10$77Qq16Zocjgdubqjw4pFUOexjN0affRziRM6Ko85EfCF7cK9MfNvq	2026-03-17 12:01:24.324	2026-02-15 16:01:24.332603	5086d4a7-519a-4496-9938-ee343f38861f
bb59e37f-b9fe-472f-b440-4be7bc6424e6	$2b$10$H3/aAHOQZjzaTrxe8oyj/.yybzRpSSOaK4z4/iXi0b94weEuDYLr.	2026-03-17 12:05:28.398	2026-02-15 16:05:28.412487	5086d4a7-519a-4496-9938-ee343f38861f
499454e5-ce6d-409f-bf9a-722d6a6b78b1	$2b$10$Mdgb0ILrjkPXaqfnz5Df9.k2l0qfuEBoIgrrjvuW/gEJJfeckktsi	2026-03-18 02:04:28.524	2026-02-16 06:04:28.529743	5086d4a7-519a-4496-9938-ee343f38861f
405d09db-b3c9-4686-9159-bace24913e60	$2b$10$8rOEjYnnLjEhpPx2l0mwGOZ4HEOH3KRW4Cf3RQ8PRqI1f4vT5mcOy	2026-03-18 02:21:40.886	2026-02-16 06:21:40.891659	5086d4a7-519a-4496-9938-ee343f38861f
a05f094f-33c3-4e31-afcb-f5f731d97cf8	$2b$10$/nz64zkNwbihlDg3Q8jN9.Bhw9UGaZhvONWqP1TtCZxBLE8jMotgS	2026-03-18 02:25:53.014	2026-02-16 06:25:53.017147	5086d4a7-519a-4496-9938-ee343f38861f
cc9c2d02-b7d7-4965-8a21-e376195f8a20	$2b$10$4VlshSWnfUR9qge0xxS/Neku4aRp9hoSG0zAE7mxQL1TNVdo87tVi	2026-03-19 11:14:22.159	2026-02-17 15:14:22.164832	5086d4a7-519a-4496-9938-ee343f38861f
e66e4aa7-b7de-421a-ba52-a4cb664578fc	$2b$10$3tCQuqbDYKw5i8WE3Abms.ungt35coNyJ5DM//y3AHXajMdHdzSA6	2026-03-19 11:19:12.326	2026-02-17 15:19:12.331739	61afbefb-6923-459b-afa3-edb5dadf8189
648cf1ac-c2ea-4d2f-8c4d-e0c5fbfd0c72	$2b$10$4ftV1eUsc.OxWEXf9i5Gj.yHPAYqMkwdcVRf9CEXJQnbHLzXM2Ubq	2026-03-19 11:19:33.469	2026-02-17 15:19:33.474266	5086d4a7-519a-4496-9938-ee343f38861f
2bcdd046-313b-4270-a26d-90a60cdfe9c5	$2b$10$Nbzy04l9IRef55mkB2OeM.uD6DHzYhD229/50WGK2rUo8hEfwJ/QO	2026-03-19 11:19:51.851	2026-02-17 15:19:51.854261	5086d4a7-519a-4496-9938-ee343f38861f
d1ecbf50-eed1-4429-ac1d-57de3a952c83	$2b$10$Wps8qTg7Rljx88B3ctUi5.QbyUtXREEYWMc5WEcF13SF/MoVgEYqS	2026-03-21 19:03:28.766	2026-02-19 23:03:28.772978	5086d4a7-519a-4496-9938-ee343f38861f
c32f824e-acb2-461b-9c4f-f1d48cbdbed0	$2b$10$t3TiZw1uVlOANNu3HYIiwONeIOILOcoYuo5V0XzzgZstmbrO9uGIG	2026-03-21 19:32:38.582	2026-02-19 23:32:38.586861	5086d4a7-519a-4496-9938-ee343f38861f
6bac7873-5aa4-48e1-8255-66fe7568243a	$2b$10$Wk.Q8XEpGVIyyMJfcrjZweY7Lv1ga/omwszaBDh.VsC4.rpvjEL.6	2026-03-22 12:39:35.035	2026-02-20 16:39:35.038508	5086d4a7-519a-4496-9938-ee343f38861f
791c6763-3267-40a9-a2cb-3201a286e2ce	$2b$10$OWvQYhkvUFOEcw.SrdmPMe8gGMnZmyO2EhbgweY2qanbzrtmyJrOa	2026-03-22 12:55:29.667	2026-02-20 16:55:29.669371	5086d4a7-519a-4496-9938-ee343f38861f
b4fa79f1-ae09-4dc0-b84c-657bc51d9750	$2b$10$5Y2W7gKC5eJPwn.JW4b8xuUB0IXbbK5hJRNMoycNovELNcELmXfHG	2026-03-22 12:56:23.725	2026-02-20 16:56:23.72867	5086d4a7-519a-4496-9938-ee343f38861f
cc40291c-7cd9-40c3-8a46-1f5fa41386d6	$2b$10$r3XHgXoYBl9A3CKOgB9BuuKQPPXap8DZHC8YY8GAOii4LXu6dNnjK	2026-03-22 13:15:24.16	2026-02-20 17:15:24.162641	5086d4a7-519a-4496-9938-ee343f38861f
f6bf5866-d598-4f84-abde-1000dc306e95	$2b$10$EKl1L7p22dI2LNx7b5vJpeLwTBPDhW3Evd6.7gSbMC7G8hAn8jkIy	2026-03-22 13:19:17.169	2026-02-20 17:19:17.173469	5086d4a7-519a-4496-9938-ee343f38861f
4bcce5ae-57f5-4731-bee8-5e1e37ff34fa	$2b$10$VSwBYsixNxPBp62WrbG5ROuVsdCyNvHWwIaQ8tWHVFiPAw3XR210.	2026-03-22 13:41:56.884	2026-02-20 17:41:56.886819	5086d4a7-519a-4496-9938-ee343f38861f
cc5413f2-b44d-4a87-b8e8-5bf991055728	$2b$10$B125vYcQEwSH7lZPzafTM.Se0E/TvHlZQVEV//R0Xj0pOjCtw7/VS	2026-03-22 22:17:20.203	2026-02-21 02:17:20.212631	5086d4a7-519a-4496-9938-ee343f38861f
e7ac51f1-5baf-4b36-b5be-61f5613364cc	$2b$10$ilezi9vF9ncJe4rNjxQT0OpvndoiQlvQWM3LepRj2xz5sMtvzFmjW	2026-03-22 23:39:56.561	2026-02-21 03:39:56.56371	5086d4a7-519a-4496-9938-ee343f38861f
5d1d2e4f-15b9-44ec-9ddf-0b2ebeb35ec6	$2b$10$SfLTHHjzImG8Ptk16jXvQOLA01Th3SEcQUB8fDNlQeQYxb3JOef/O	2026-03-22 23:56:30.224	2026-02-21 03:56:30.22806	5086d4a7-519a-4496-9938-ee343f38861f
5b0ebd53-1277-46aa-bff6-9a0368dcb12e	$2b$10$PYoWAJZzNoq7U8FSmJ3FF.HWCjQtnbGBaiTpps5uT19aUs4hr5LHC	2026-03-23 10:25:03.262	2026-02-21 14:25:03.269926	5086d4a7-519a-4496-9938-ee343f38861f
2b7a39a9-13a4-47e2-a712-0a87d3f99761	$2b$10$HG4G424HqBcLOCORMYp2TOSnxvEesNz9g4r74GBdxKqyP0bZOwugS	2026-03-25 13:02:30.805	2026-02-23 17:02:30.810638	5086d4a7-519a-4496-9938-ee343f38861f
ac9d1b16-99b7-4846-836f-df9bea22e74b	$2b$10$2e1bSOGugMl7LoZyUWtjFOP9POSZ5a38UcVuIv3KltmbSqy90XjqW	2026-03-29 11:26:42.795	2026-02-27 15:26:42.807489	5086d4a7-519a-4496-9938-ee343f38861f
9a10802c-3884-430f-83c2-bd7ae128294a	$2b$10$W3Y8jJsv/5B9zURQeHxH6eEsQmtJf19kDLQgZBWqvK2qUhlj8n0Vy	2026-03-29 11:54:46.003	2026-02-27 15:54:46.007684	5086d4a7-519a-4496-9938-ee343f38861f
8c4a5c3c-a617-48d3-83ac-23f774ec75b0	$2b$10$7g97KdOFGeZxfZ2hj/ePjuh4aX2kO1tnr74A4YyvSii9he3QyAFhi	2026-03-30 22:26:27.535	2026-03-01 02:26:27.545757	5086d4a7-519a-4496-9938-ee343f38861f
631c1fa5-bcef-4669-bbb8-c10309a037ea	$2b$10$NoP7CwH6HcFtwfnbt3Z63urbqtC5./6KUfTbS6oO8rE6E1EP7PRVC	2026-03-31 13:12:57.813	2026-03-01 17:12:57.816694	5086d4a7-519a-4496-9938-ee343f38861f
349c3b6a-2ff1-4fb0-b33e-23145be33253	$2b$10$oGjGAT7mNHyr0UGE0du0BO1rjItYjuU9Mxk3cruRraTysCt3zS0ye	2026-03-31 18:19:35.077	2026-03-01 22:19:35.088417	5086d4a7-519a-4496-9938-ee343f38861f
179829c9-f376-465a-89df-e2c784d4d4df	$2b$10$uS6MLX8iHC8BfSfwuV5e4.ZqK5mzahL7w/Frn3NRVmlFr5cexog8y	2026-03-31 18:27:23.618	2026-03-01 22:27:23.62217	5086d4a7-519a-4496-9938-ee343f38861f
b598a6f5-e08b-44a4-8116-cbdb7301b146	$2b$10$8X2Fhf3.AROtlWlRwcB9guSJByDDtj11HaQlAzVqbyX0dCnpgpahG	2026-03-31 18:52:59.45	2026-03-01 22:52:59.458636	5086d4a7-519a-4496-9938-ee343f38861f
2ed808d8-9e39-4a49-a5f3-d514c89a3cb1	$2b$10$k/0dMAV9Q8XTswf6SzlcaubSOjgrrgQRHko4DX.7bhP6HBwCoG4RW	2026-03-31 19:12:39.24	2026-03-01 23:12:39.243202	5086d4a7-519a-4496-9938-ee343f38861f
71582237-66b4-411e-8ec4-3631dfdcc49e	$2b$10$cLLk.xJGHzPmWw5XmiwTG.7u.25BENmfOt06/3ukrYA5hjLSbueSy	2026-03-31 20:03:54.116	2026-03-02 00:03:54.122974	5086d4a7-519a-4496-9938-ee343f38861f
9162dc31-9f85-4b48-beae-a567b8aecc8c	$2b$10$E6QQw9Lk3wxYQzFxSZM/feL8UnVbLv83gaW1ubLke9I0P1u7u9hQC	2026-04-01 11:27:29.79	2026-03-02 15:27:29.800768	5086d4a7-519a-4496-9938-ee343f38861f
414a78d7-3947-4044-8ac0-676ecaa0e84d	$2b$10$QJM2toK/ztyoxcscTr/hHOZfMfTlBNPYyFTLjSpVIrsLuKatIAkEu	2026-04-01 11:53:11.822	2026-03-02 15:53:11.827219	5086d4a7-519a-4496-9938-ee343f38861f
78f843f7-dc82-467b-a51f-e2c8fd26fda3	$2b$10$i7xIQeY49tByqJTI2y7rgOCIwZ6T9cspBzcyBjmL1ZVsqwrul2oVe	2026-04-01 12:14:46.661	2026-03-02 16:14:46.66732	5086d4a7-519a-4496-9938-ee343f38861f
3d0a7bc3-e293-4c13-ad12-9a2ecd23bd02	$2b$10$xRoHMbWbPwZJwGusu4I7KOWi9PPT5.7rqrKW.873SawX7yyDuYAa2	2026-04-01 13:43:52.282	2026-03-02 17:43:52.284718	5086d4a7-519a-4496-9938-ee343f38861f
a927f41c-d8e8-419e-bf9b-f945b1f5b14a	$2b$10$iSVgZgqUHDl5aA8UzuO0N.YWpZ8dSD3p3J/uiF6osazbLCmhRatWy	2026-04-10 10:53:36.086	2026-03-11 14:53:36.088415	5086d4a7-519a-4496-9938-ee343f38861f
3df0c7c5-e7c9-4a93-ac4b-ee58c8323e6a	$2b$10$Pb0Xql4o9Qm25hxXKPp1r.L8r2RaKBO3TGVTAXwMQtxY6cHJvvwIO	2026-04-10 12:28:01.144	2026-03-11 16:28:01.150202	5086d4a7-519a-4496-9938-ee343f38861f
fcc9f0eb-ca95-4a4e-8b27-04f356d4a706	$2b$10$7mtN8q2bQ12o90nEOeSWlOzbMsm0cwgXcnqqO9qxhJPJOE6Lhjs9a	2026-04-10 13:11:13.794	2026-03-11 17:11:13.799236	5086d4a7-519a-4496-9938-ee343f38861f
560cf857-0570-411c-b923-0877e7fee9a9	$2b$10$1TVqhrrmprhzbpJmtxkVmuqb7uHkpALQMulN06S/wtcG44COKdkDK	2026-04-13 08:03:59.971	2026-03-14 12:03:59.976219	5086d4a7-519a-4496-9938-ee343f38861f
d798053d-f43a-4578-9563-bb41ad3b7274	$2b$10$shTYg1cNFufMScEP7LkxJuk..tfoLLJs8bXoIhcybJOhx0k8.rigq	2026-04-13 08:06:30.559	2026-03-14 12:06:30.561993	fde32463-d342-4cc0-8e8c-1845ce2162b7
e8056913-6fd6-423d-832c-5f973f04b165	$2b$10$vzbYbiOc/7JD9sGswVT0puAxtE/4AzfL1hg4IgiRRc4KFZNFua3e6	2026-04-15 09:08:28.047	2026-03-16 13:08:28.055146	5086d4a7-519a-4496-9938-ee343f38861f
cedc4eee-772f-4daa-8cc5-6f43753724c8	$2b$10$Tq5f3IELB4VOWVmG4rbMi.3dlrBU0fESSVMDA3LHgCVhvOC7Z6YHa	2026-04-15 09:15:06.626	2026-03-16 13:15:06.630134	5086d4a7-519a-4496-9938-ee343f38861f
a28c4ac5-8d5d-4cdf-b08f-e11933226c2c	$2b$10$SLkJtOM0H2GeNs8AV0Bs/uWyxjhNtGSxTkD56YjngAZw6z2ajECUi	2026-04-15 10:12:15.729	2026-03-16 14:12:15.732064	5086d4a7-519a-4496-9938-ee343f38861f
4d154df3-724e-4995-8fdd-f2961ccd1ca7	$2b$10$polHSE65TASKyONUsRR4UOmu8hzk2gufrf7abPPBrTRELr6JskPL6	2026-04-15 10:12:55.785	2026-03-16 14:12:55.790088	5086d4a7-519a-4496-9938-ee343f38861f
1534e49d-27ac-46c5-98d2-7921ffa89ab9	$2b$10$rskZJg7GCK2L0t/lVfZs4.ILdkqllYs0mE6maZHQMa8g8GGQ0f3AG	2026-04-15 10:14:11.696	2026-03-16 14:14:11.699677	5086d4a7-519a-4496-9938-ee343f38861f
118da4ce-14da-47df-b101-d67395b01ad1	$2b$10$WAZFvv0woML1n6UTGH153OlddpwCsWA2JyYUG9cw4QtHY9Eqv3gWq	2026-04-17 14:03:07.989	2026-03-18 18:03:07.997285	5086d4a7-519a-4496-9938-ee343f38861f
78e32120-7fb6-44c3-acec-5db74c02c1e1	$2b$10$k60PUDeJsW47zxUUkMBq.OTu3/maRT3Q/t7fTdg62gKPKEYO1ZQmm	2026-04-18 09:52:20.843	2026-03-19 13:52:20.848641	5086d4a7-519a-4496-9938-ee343f38861f
f3d95f69-aeac-44d4-995a-e63c3694880e	$2b$10$paQ6K9mfIgTG0.lRZ2R1CONdSLWka22BlmkvkdaaZZqfGXJw3X7fi	2026-04-18 09:55:27.473	2026-03-19 13:55:27.476725	5086d4a7-519a-4496-9938-ee343f38861f
eefb0aff-6d8c-4a6c-b8ec-ef0d069abe46	$2b$10$q0W7bH.piCnusFRyp84zqOlZ1qQAbU9nE4dTT.SnS75DsyFtXy74q	2026-04-19 11:02:29.851	2026-03-20 15:02:29.865971	5086d4a7-519a-4496-9938-ee343f38861f
2db15668-0d33-4ea5-857d-d9a6866a98d4	$2b$10$q7mKS1tCb9vUbg6x.ROy5ONdgqTtoPWq6jGEMKxbj0kCrYhM.yt1u	2026-04-22 18:51:08.173	2026-03-23 22:51:08.18074	5086d4a7-519a-4496-9938-ee343f38861f
\.


--
-- Data for Name: skill_node_dependencies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.skill_node_dependencies (id, node_id, depends_on_id) FROM stdin;
49b19a00-df57-4e2a-a043-8d95860b0721	d96755f4-967d-40e6-8809-5bcf05427e7f	8aa92ad7-e049-4186-8006-d70b69d52a76
4fc09067-ef77-4926-8b75-1c493aadb5cd	04f5da57-2d11-4963-94cc-29696e2c188e	d96755f4-967d-40e6-8809-5bcf05427e7f
fc8d7623-7660-448d-ae2f-5cc99ed0768c	e0a52c12-072a-4e46-8468-934add6e0e6e	04f5da57-2d11-4963-94cc-29696e2c188e
1d6cf4ba-e553-4070-a461-9adeeba3a338	9dceec3a-4d0b-42ba-9570-135eb6d4314d	e0a52c12-072a-4e46-8468-934add6e0e6e
86e977d5-1774-4ce1-ad94-ae26c5d35be2	42371798-054c-44ac-b00e-32d71cd5b809	9dceec3a-4d0b-42ba-9570-135eb6d4314d
\.


--
-- Data for Name: skill_nodes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.skill_nodes (id, slug, name, description, icon, category, module_id, required_exercises, required_challenges, position_x, position_y, xp_reward) FROM stdin;
8aa92ad7-e049-4186-8006-d70b69d52a76	variables	Variables y Tipos	Aprende a guardar información básica.	📦	fundamentals	1	3	0	200	150	50
d96755f4-967d-40e6-8809-5bcf05427e7f	conditionals	Condicionales	Toma decisiones en tu código.	⚖️	fundamentals	2	3	0	450	150	50
04f5da57-2d11-4963-94cc-29696e2c188e	loops	Bucles	Repite tareas eficientemente.	🔁	fundamentals	3	4	0	700	150	50
e0a52c12-072a-4e46-8468-934add6e0e6e	functions	Funciones	Reutiliza bloques de código.	𝑓	fundamentals	4	3	0	950	150	50
9dceec3a-4d0b-42ba-9570-135eb6d4314d	arrays	Arrays	Listas de elementos.	📊	data_structures	5	5	0	450	400	50
42371798-054c-44ac-b00e-32d71cd5b809	objects	Objetos	Estructuras clave-valor.	🎒	data_structures	6	4	0	700	400	50
\.


--
-- Data for Name: user_badges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_badges (id, user_id, badge_id, unlocked_at) FROM stdin;
8c847dca-d412-441d-a58e-d93e19fc077d	40540771-bd01-477e-9bd9-1a97e9791fd1	variables_master	2026-01-04 08:15:20.413
b2fd586c-2006-4afd-a524-80f8ed19d821	40540771-bd01-477e-9bd9-1a97e9791fd1	night_owl	2025-11-19 08:15:20.415
7026876e-3a2a-4b69-b00e-0c9b7e103ee6	40540771-bd01-477e-9bd9-1a97e9791fd1	dedicated_student	2025-11-06 08:15:20.417
64c0aefc-c9a8-403a-a277-d7e9f7033c33	40540771-bd01-477e-9bd9-1a97e9791fd1	perfect_score	2026-01-01 08:15:20.418
b4529234-da7a-401c-863d-3be39e93733f	40540771-bd01-477e-9bd9-1a97e9791fd1	on_the_way	2026-01-23 08:15:20.42
6ef25fa4-ae4e-42d4-9812-7401a72b248a	40540771-bd01-477e-9bd9-1a97e9791fd1	conditionals_master	2025-10-11 09:15:20.422
2ffa02c3-9e59-48c6-8bcd-de776ab0cf03	40540771-bd01-477e-9bd9-1a97e9791fd1	level_5	2025-11-14 08:15:20.424
bb203887-6472-44a7-b82c-d6986df41d1e	40540771-bd01-477e-9bd9-1a97e9791fd1	community_star	2025-10-09 09:15:20.425
2bde3c7e-5e51-4d48-90e2-bf7ed4e8af7f	27a7b508-cfef-4e86-a91c-1cbb6ef7d556	level_5	2025-08-04 09:15:20.427
f2eab6f2-baae-431c-8ff3-7e446ae91836	27a7b508-cfef-4e86-a91c-1cbb6ef7d556	conditionals_master	2026-01-22 08:15:20.429
6fa9c054-0a08-4042-953c-5cbfe8200e31	27a7b508-cfef-4e86-a91c-1cbb6ef7d556	on_the_way	2025-09-22 09:15:20.43
bd0977c1-b598-48df-bb7d-000f1c83e872	27a7b508-cfef-4e86-a91c-1cbb6ef7d556	first_steps	2025-09-15 09:15:20.432
a6b08da1-c5cb-4585-849b-da82ca79a5f1	27a7b508-cfef-4e86-a91c-1cbb6ef7d556	dedicated_student	2025-12-22 08:15:20.433
56680049-52ac-4ad9-a5b8-85c49a6156a2	27a7b508-cfef-4e86-a91c-1cbb6ef7d556	functions_master	2025-11-24 08:15:20.435
3009b463-5ab5-4534-910c-ab7822c2dd3a	27a7b508-cfef-4e86-a91c-1cbb6ef7d556	persistent	2025-09-07 09:15:20.438
915d2b80-7f11-4fe5-b90a-316a52631bb9	27a7b508-cfef-4e86-a91c-1cbb6ef7d556	night_owl	2026-01-24 08:15:20.439
6d94841b-7cfa-45d6-bdca-df1ccec12ac2	27a7b508-cfef-4e86-a91c-1cbb6ef7d556	speed_demon	2025-12-25 08:15:20.441
1c715016-c33e-480a-b8f8-8077b1123e90	f3642b14-2e93-44f2-84fc-db0ed83b404f	level_10	2025-11-08 08:15:20.442
a33b577a-d56d-476c-9c96-844c4e544a0d	f3642b14-2e93-44f2-84fc-db0ed83b404f	level_5	2025-10-23 09:15:20.444
486fde49-0b49-4d22-aab9-9a2b0b29410d	f3642b14-2e93-44f2-84fc-db0ed83b404f	early_bird	2025-10-14 09:15:20.445
e140447b-366f-490b-bb16-492c057a285a	f3642b14-2e93-44f2-84fc-db0ed83b404f	conditionals_master	2025-12-10 08:15:20.447
b2428ca2-40b2-456c-983e-674196935b81	f3642b14-2e93-44f2-84fc-db0ed83b404f	dedicated_student	2026-01-21 08:15:20.448
50b5200f-aa14-44ac-8d72-6e42e91cd623	f3642b14-2e93-44f2-84fc-db0ed83b404f	on_the_way	2025-09-08 09:15:20.45
3f6d46d0-cbca-4dc1-b23d-4d4abb3e34a2	f3642b14-2e93-44f2-84fc-db0ed83b404f	variables_master	2025-09-26 09:15:20.451
9a077a4a-a5c9-4b77-b4e1-6805ad607db9	f3642b14-2e93-44f2-84fc-db0ed83b404f	first_steps	2025-10-01 09:15:20.453
515453d9-dd98-4c6b-834d-06d9f835da22	f3642b14-2e93-44f2-84fc-db0ed83b404f	perfect_score	2025-09-29 09:15:20.454
687847b1-d3be-426b-ae9c-d1e3d5afbb6e	dcbd21e4-2164-4f08-b560-e3e06c906b12	variables_master	2025-09-03 09:15:20.456
6e9ba0d4-c0e4-4bd5-81da-c2ca81038125	dcbd21e4-2164-4f08-b560-e3e06c906b12	speed_demon	2025-10-21 09:15:20.458
2b785184-91a7-4009-963c-6e36b8808d05	dcbd21e4-2164-4f08-b560-e3e06c906b12	level_10	2025-08-12 09:15:20.459
55e1bc7a-796c-4496-bba7-d3bc45146e20	dcbd21e4-2164-4f08-b560-e3e06c906b12	perfect_score	2025-08-05 09:15:20.461
bf7287d5-55c2-478c-82c6-a5c4a4b1ee4e	dcbd21e4-2164-4f08-b560-e3e06c906b12	functions_master	2025-12-27 08:15:20.463
d51e7241-8b37-4f8f-997f-bb3d75c617a8	dcbd21e4-2164-4f08-b560-e3e06c906b12	conditionals_master	2025-08-21 09:15:20.465
ce8aa1de-5333-403f-86ab-f6c2193f549d	dcbd21e4-2164-4f08-b560-e3e06c906b12	night_owl	2025-11-28 08:15:20.467
c2c42c86-97dd-430b-9c46-7daf55ca0ab7	dcbd21e4-2164-4f08-b560-e3e06c906b12	community_star	2026-01-27 08:15:20.468
76b7a0cc-d0d0-482e-8465-0d8bfbf7011c	dcbd21e4-2164-4f08-b560-e3e06c906b12	level_5	2025-10-31 09:15:20.47
53c8f5fb-b879-481a-abdc-2cc6065cf3af	dcbd21e4-2164-4f08-b560-e3e06c906b12	loops_master	2025-09-08 09:15:20.472
b00ba80e-25ba-4a80-abd7-e656695c5c77	dcbd21e4-2164-4f08-b560-e3e06c906b12	early_bird	2025-12-09 08:15:20.474
cf400fd4-a35a-46af-9628-b4e0709abf90	f2833746-a709-416f-b755-7efdf87e3ac5	on_the_way	2025-12-29 08:15:20.475
3e45dadc-4460-40b4-8d85-6fd2fbd9f6fa	f2833746-a709-416f-b755-7efdf87e3ac5	speed_demon	2025-12-19 08:15:20.477
77339015-8fc4-440c-a592-ad374341f01d	f2833746-a709-416f-b755-7efdf87e3ac5	night_owl	2025-09-21 09:15:20.479
b8e40eaf-817a-4790-bb8b-bb5a9f7ad9bb	f2833746-a709-416f-b755-7efdf87e3ac5	variables_master	2025-09-25 09:15:20.481
bed24465-8333-4949-8a6b-e089f14ec026	f2833746-a709-416f-b755-7efdf87e3ac5	persistent	2025-10-29 09:15:20.482
5ab07e1b-c2be-4b14-8404-0e3c9d93031d	f2833746-a709-416f-b755-7efdf87e3ac5	first_steps	2025-09-19 09:15:20.484
c142d277-2531-488a-bb22-29867bcbd57d	f2833746-a709-416f-b755-7efdf87e3ac5	dedicated_student	2025-12-29 08:15:20.485
b1999971-394c-4111-a435-e16634082690	f2833746-a709-416f-b755-7efdf87e3ac5	early_bird	2025-11-07 08:15:20.487
5100c599-4faf-4b6f-8abd-e6a23a972f70	2f8e040e-fdce-4d63-908b-7d290e6c7ed1	persistent	2025-12-07 08:15:20.488
a79c758c-d0a5-460a-82d4-e3d2bd8c6101	2f8e040e-fdce-4d63-908b-7d290e6c7ed1	level_5	2025-10-09 09:15:20.491
944f3c73-a08e-44ba-b0d5-0ffbbef86f29	2f8e040e-fdce-4d63-908b-7d290e6c7ed1	night_owl	2025-12-29 08:15:20.493
dcb2c056-556d-4e51-a305-ea87c9e05507	2f8e040e-fdce-4d63-908b-7d290e6c7ed1	loops_master	2025-09-22 09:15:20.494
05c3dfcd-f81d-4217-943d-475c791330d4	2f8e040e-fdce-4d63-908b-7d290e6c7ed1	dedicated_student	2025-12-08 08:15:20.496
45838760-4d43-4b0e-a922-90c6bdfa6ec0	2f8e040e-fdce-4d63-908b-7d290e6c7ed1	community_star	2025-10-21 09:15:20.497
fdc962e2-d3fd-4888-ba5a-996cd6ff1948	2f8e040e-fdce-4d63-908b-7d290e6c7ed1	speed_demon	2025-10-27 09:15:20.499
8cdc8146-4860-40c2-83f1-ccdd229bd08e	84fa5ae9-2b10-4102-83b0-391accda9aba	loops_master	2025-11-19 08:15:20.5
1e38d978-f40a-4566-91c2-80187ea8ad53	84fa5ae9-2b10-4102-83b0-391accda9aba	community_star	2026-01-24 08:15:20.502
e6a1ebfa-0d87-4427-bb42-df989cfaef8f	84fa5ae9-2b10-4102-83b0-391accda9aba	variables_master	2025-10-05 09:15:20.503
979a2a0a-7485-4687-87cf-2e3601a2d204	84fa5ae9-2b10-4102-83b0-391accda9aba	level_5	2025-08-07 09:15:20.506
85e8e941-a010-43a2-bf27-b47e8d5ddb40	84fa5ae9-2b10-4102-83b0-391accda9aba	speed_demon	2025-08-28 09:15:20.507
ccb7057d-7965-4350-adde-5447bd7f6275	84fa5ae9-2b10-4102-83b0-391accda9aba	night_owl	2025-11-27 08:15:20.509
c1888f72-4ac6-4884-8420-896a7df48320	84fa5ae9-2b10-4102-83b0-391accda9aba	first_steps	2026-01-20 08:15:20.511
431335df-f273-4a68-b479-acfdbd2fc18b	84fa5ae9-2b10-4102-83b0-391accda9aba	functions_master	2025-09-10 09:15:20.513
32685344-2be4-4923-bb10-caef30e8989e	9f8dd3c6-3a70-4541-94a6-a4ea9ce5c5ce	first_steps	2025-09-05 09:15:20.514
1e605f1e-221c-4e72-8b6f-e4a979d68c65	9f8dd3c6-3a70-4541-94a6-a4ea9ce5c5ce	persistent	2025-12-09 08:15:20.516
fbab36a8-7792-4bf6-8923-e5f3662a3aea	9f8dd3c6-3a70-4541-94a6-a4ea9ce5c5ce	speed_demon	2025-11-01 09:15:20.518
2005b559-a5fc-4e78-b022-b282ae139787	9f8dd3c6-3a70-4541-94a6-a4ea9ce5c5ce	on_the_way	2025-11-23 08:15:20.52
d597623e-c173-4090-873e-0acdc1d3a6bf	9f8dd3c6-3a70-4541-94a6-a4ea9ce5c5ce	functions_master	2025-11-15 08:15:20.521
29c65bd3-ac84-4480-91b8-21f8d6672a2b	9f8dd3c6-3a70-4541-94a6-a4ea9ce5c5ce	community_star	2025-10-11 09:15:20.522
550ba128-591b-4a59-9f22-bd740484a660	9f8dd3c6-3a70-4541-94a6-a4ea9ce5c5ce	dedicated_student	2025-08-08 09:15:20.524
5a28ad45-9fc9-4243-8783-00b779f07a68	9f8dd3c6-3a70-4541-94a6-a4ea9ce5c5ce	night_owl	2026-01-30 08:15:20.525
afac2083-1293-48ba-ae6d-7bdc7ce41887	ba870ced-b54a-42e1-93bf-9bf0df99d544	first_steps	2026-01-12 08:15:20.527
7ed1dbc3-9151-4d07-8eee-8b8413a4c932	ba870ced-b54a-42e1-93bf-9bf0df99d544	on_the_way	2025-09-19 09:15:20.529
3934f840-4e6d-4d11-be2f-74c51f95bdf3	ba870ced-b54a-42e1-93bf-9bf0df99d544	speed_demon	2025-08-24 09:15:20.53
552d2b74-5b60-43a0-9f8e-a809fcd7f663	ba870ced-b54a-42e1-93bf-9bf0df99d544	dedicated_student	2025-11-05 08:15:20.532
42ca953e-78ea-4e1d-be9f-e4f944c5c7fa	ba870ced-b54a-42e1-93bf-9bf0df99d544	conditionals_master	2025-08-25 09:15:20.534
d25d8169-7305-4fac-bc8f-beac5b53fc71	ba870ced-b54a-42e1-93bf-9bf0df99d544	variables_master	2025-09-23 09:15:20.535
9c8f596b-2e8d-460f-b144-5f9188f13c42	ba870ced-b54a-42e1-93bf-9bf0df99d544	community_star	2025-11-08 08:15:20.537
79212a3d-8b2b-48ad-a4b5-6b95f903ee41	238b9dac-2644-427e-8bd2-ed4c3abb8890	night_owl	2025-12-14 08:15:20.55
6875ba3a-4b84-4b1f-8caf-75d33277e656	238b9dac-2644-427e-8bd2-ed4c3abb8890	first_steps	2025-08-26 09:15:20.552
bb3003ce-46e0-488b-acc6-795eb88244bf	238b9dac-2644-427e-8bd2-ed4c3abb8890	on_the_way	2025-12-09 08:15:20.555
24fc581f-9dea-44d3-a712-f7c0566a889d	238b9dac-2644-427e-8bd2-ed4c3abb8890	dedicated_student	2025-10-19 09:15:20.556
7fd4ee02-5306-4f72-8a62-b5ab7e6ef2f3	238b9dac-2644-427e-8bd2-ed4c3abb8890	level_5	2025-10-19 09:15:20.558
08117d69-3644-4b6f-873a-699e503a804d	238b9dac-2644-427e-8bd2-ed4c3abb8890	community_star	2025-11-08 08:15:20.559
d56f3b25-0a5d-4edc-9c14-63a7e7ad4906	6f2a0c6d-6e90-4cd6-8774-abd9c722c6b4	conditionals_master	2025-11-08 08:15:20.561
096d8010-cc67-4ecf-b2e5-38bd195c8f66	6f2a0c6d-6e90-4cd6-8774-abd9c722c6b4	dedicated_student	2025-08-29 09:15:20.563
e482beed-9902-4d3a-a62d-e8ce564df208	6f2a0c6d-6e90-4cd6-8774-abd9c722c6b4	speed_demon	2025-11-29 08:15:20.564
a1087d37-cab5-423a-b6d6-45fac4ea81b6	6f2a0c6d-6e90-4cd6-8774-abd9c722c6b4	on_the_way	2025-08-30 09:15:20.565
ca91a312-5bde-41fa-825f-2ec80734cad0	6f2a0c6d-6e90-4cd6-8774-abd9c722c6b4	community_star	2025-10-18 09:15:20.567
470ba381-93a0-4f37-85af-5f4fc691408f	6f2a0c6d-6e90-4cd6-8774-abd9c722c6b4	functions_master	2025-09-07 09:15:20.569
1734ae94-07d0-423b-8100-569a9c88f313	5120f1c6-507e-4a5b-aa9f-53241f3a2b9b	community_star	2025-08-13 09:15:20.57
49628f4e-2693-4a65-8dff-118090b87681	5120f1c6-507e-4a5b-aa9f-53241f3a2b9b	persistent	2025-10-17 09:15:20.571
d73bfa17-f98d-4dc5-9082-af5578df9603	5120f1c6-507e-4a5b-aa9f-53241f3a2b9b	conditionals_master	2026-01-26 08:15:20.573
5d49fde1-c9af-449d-8870-4f5bbd31686f	5120f1c6-507e-4a5b-aa9f-53241f3a2b9b	variables_master	2025-10-06 09:15:20.575
3e63c379-acec-4a42-ae86-9e751ac8a8a8	5120f1c6-507e-4a5b-aa9f-53241f3a2b9b	loops_master	2026-01-14 08:15:20.577
a5713eec-0975-4ada-86cd-0016a77c2603	b96b833c-b88d-40f6-80df-146bdd457983	first_steps	2025-10-26 09:15:20.579
b1080ce2-4797-47c9-9bad-164b9cdb28c2	b96b833c-b88d-40f6-80df-146bdd457983	loops_master	2025-11-07 08:15:20.58
36292276-901a-4dff-a98c-e3cbd178763b	b96b833c-b88d-40f6-80df-146bdd457983	level_10	2025-10-21 09:15:20.582
2017fe54-28c0-4230-a63d-f81a7e60670d	b96b833c-b88d-40f6-80df-146bdd457983	persistent	2025-11-30 08:15:20.583
cff7bac8-2c29-4fee-9025-fd4547f47c33	b96b833c-b88d-40f6-80df-146bdd457983	night_owl	2025-10-02 09:15:20.585
23bf87b0-23da-4837-9741-26b93c4373b0	eb7f7b5a-e424-4faa-87ba-ff4d35c81cc4	conditionals_master	2025-10-27 09:15:20.587
fa125bb0-b7f6-45dc-8cac-ec44db0f364e	eb7f7b5a-e424-4faa-87ba-ff4d35c81cc4	level_5	2025-09-18 09:15:20.589
a466ecc6-513a-464a-b3e7-fe52c2082a83	eb7f7b5a-e424-4faa-87ba-ff4d35c81cc4	dedicated_student	2025-10-03 09:15:20.591
bf83b0b8-7c3f-46a3-a9ca-3a320f0e0494	eb7f7b5a-e424-4faa-87ba-ff4d35c81cc4	functions_master	2025-09-22 09:15:20.592
482a0b80-ce23-464f-8b4b-2c9184ad3912	eb7f7b5a-e424-4faa-87ba-ff4d35c81cc4	variables_master	2025-12-16 08:15:20.593
8b0ef54d-815b-488d-9a4f-aed4ad9a79e1	484180d6-851b-461b-9995-07d3e3fb0116	community_star	2025-12-09 08:15:20.596
fd911118-fae8-4698-9326-ca5d4e28a41d	484180d6-851b-461b-9995-07d3e3fb0116	first_steps	2025-09-01 09:15:20.597
eea66fca-a669-46a1-9952-a96d5cf48e55	484180d6-851b-461b-9995-07d3e3fb0116	on_the_way	2025-12-13 08:15:20.598
6d0e4d2f-c7ce-48c4-b282-30895bbed8e5	484180d6-851b-461b-9995-07d3e3fb0116	speed_demon	2026-01-15 08:15:20.6
6b132097-98b7-449a-a9e7-8592540f7322	484180d6-851b-461b-9995-07d3e3fb0116	night_owl	2026-01-25 08:15:20.601
fb8f2b29-ee6b-482a-bc38-2b7c82279999	484180d6-851b-461b-9995-07d3e3fb0116	persistent	2025-11-14 08:15:20.604
6d06f543-3292-4d41-87c7-795fad35e854	484180d6-851b-461b-9995-07d3e3fb0116	loops_master	2025-08-16 09:15:20.606
044b6334-687e-4efa-8f1c-31f2bb670a22	484180d6-851b-461b-9995-07d3e3fb0116	early_bird	2025-11-10 08:15:20.608
1b783b30-ac9c-48be-9f99-6cfc772a1c6f	2f1ccf7a-022a-4f35-befc-7b401c50aa38	level_5	2025-08-31 09:15:20.61
df561e72-8465-42c1-ad51-52c1b7794a21	2f1ccf7a-022a-4f35-befc-7b401c50aa38	dedicated_student	2025-08-20 09:15:20.611
f4885a8c-3133-4e1b-8cdc-1c782fae0525	cf7c11a7-a38d-4241-81ff-180548d5f270	persistent	2025-12-03 08:15:20.613
a7058324-f387-4ec0-a86f-f41c14f43305	cf7c11a7-a38d-4241-81ff-180548d5f270	first_steps	2025-10-13 09:15:20.614
b54ff3f2-e0d9-4660-afad-46b9911d1164	cf7c11a7-a38d-4241-81ff-180548d5f270	on_the_way	2025-08-20 09:15:20.616
81e0dda5-e82a-4642-ad56-6037272bb343	cf7c11a7-a38d-4241-81ff-180548d5f270	dedicated_student	2025-08-13 09:15:20.617
fe4a6130-c49f-4166-a3f6-4c2a2058a462	0566f71b-c470-4fd6-9223-79ec9b266a9b	perfect_score	2025-09-10 09:15:20.619
ddbebd46-57d0-474b-ade5-ad619aab9b2d	0566f71b-c470-4fd6-9223-79ec9b266a9b	persistent	2025-11-01 09:15:20.62
a0501e5a-cfb0-4ab8-8d0c-7e8e1940475f	0566f71b-c470-4fd6-9223-79ec9b266a9b	level_5	2025-12-18 08:15:20.621
e5b12556-842f-4da1-83ab-d6e2cb9858ee	0566f71b-c470-4fd6-9223-79ec9b266a9b	conditionals_master	2025-10-25 09:15:20.623
f48b7778-59de-48c5-aebe-fd5a723d6bf6	0566f71b-c470-4fd6-9223-79ec9b266a9b	variables_master	2025-09-13 09:15:20.625
0fae152b-8095-4394-b779-7cf9aa519190	5a8e03d7-2b9b-4330-b28a-a64d9ea31629	conditionals_master	2025-10-19 09:15:20.626
a5db3afc-29c3-4a3f-8c43-5bcf95a7b545	5a8e03d7-2b9b-4330-b28a-a64d9ea31629	night_owl	2025-08-29 09:15:20.628
82df43b4-b63a-4101-b035-d1fa05421f3e	5a8e03d7-2b9b-4330-b28a-a64d9ea31629	loops_master	2025-12-01 08:15:20.63
bc2d68e6-77c0-4e8a-b1e9-44e9a6338b49	5a8e03d7-2b9b-4330-b28a-a64d9ea31629	persistent	2025-11-16 08:15:20.632
eb2c7e7c-d8f6-4927-a5ea-b655d5b2060f	5a8e03d7-2b9b-4330-b28a-a64d9ea31629	first_steps	2025-11-15 08:15:20.634
28dd3841-3a3d-4c88-8515-ce560fce043b	6e69e1f1-2d77-49da-bc84-62f12a401fdb	first_steps	2026-01-19 08:15:20.636
7df886d4-74ae-44fe-897e-e8c9c1aec7b7	6e69e1f1-2d77-49da-bc84-62f12a401fdb	conditionals_master	2025-09-04 09:15:20.638
9f28ae40-3681-4f53-87d2-84f92b083807	6e69e1f1-2d77-49da-bc84-62f12a401fdb	variables_master	2025-12-26 08:15:20.639
a5cd635a-3c03-40d7-a2dc-c8d8f99eafae	6e69e1f1-2d77-49da-bc84-62f12a401fdb	on_the_way	2025-12-21 08:15:20.641
24df16f2-92c5-466d-81ab-9dce1f79b5d3	4b1c2adf-90d0-48e2-a40e-3950a4ce2a83	loops_master	2025-09-01 09:15:20.642
828df601-067a-45d6-b75e-831ac846ab51	4b1c2adf-90d0-48e2-a40e-3950a4ce2a83	conditionals_master	2026-01-20 08:15:20.644
abac13f0-c6a0-408a-936f-56f3b04ae02a	4b1c2adf-90d0-48e2-a40e-3950a4ce2a83	dedicated_student	2025-12-18 08:15:20.645
7cd6f3da-cde6-4584-95bb-c44acb3be0b8	b6afb299-43be-4bc6-86ee-434584f5f0a2	perfect_score	2025-12-06 08:15:20.647
2d935125-aa12-4032-a690-bb441d51c96d	b6afb299-43be-4bc6-86ee-434584f5f0a2	variables_master	2025-12-30 08:15:20.648
3890f5d1-461a-40fe-be2d-2b0b73669692	b6afb299-43be-4bc6-86ee-434584f5f0a2	speed_demon	2025-09-14 09:15:20.65
5895b3bf-41e6-4bf3-a126-1cfb8618d6eb	444cd236-b686-4c61-87c9-2a9e87933d7b	night_owl	2025-09-15 09:15:20.652
eb6014bd-c506-497c-be34-80255d4edad5	444cd236-b686-4c61-87c9-2a9e87933d7b	dedicated_student	2026-01-22 08:15:20.653
4efa1744-6ac4-46cc-819a-91518d479d35	03022b17-5967-486d-818e-85a2b71056d5	first_steps	2025-11-02 08:15:20.654
fb44a04f-14dc-48b9-a1f8-9f0d813d9058	03022b17-5967-486d-818e-85a2b71056d5	level_10	2025-09-13 09:15:20.657
e5675713-d540-4caf-a9cc-d197829ef843	03022b17-5967-486d-818e-85a2b71056d5	early_bird	2025-08-15 09:15:20.659
33a32098-61cb-440b-97ae-a804e88209b7	50b2fd75-14de-406c-9db1-e61588b96068	first_steps	2025-08-25 09:15:20.66
ed8899e8-29c2-4896-942b-83610c1e6e30	50b2fd75-14de-406c-9db1-e61588b96068	dedicated_student	2025-08-27 09:15:20.661
1418bf6c-9ba3-4e5f-a425-0318b4b6719c	50b2fd75-14de-406c-9db1-e61588b96068	functions_master	2025-11-06 08:15:20.663
a2a7cda3-30a5-4044-b8dd-ca3eff05579a	5a41b008-7743-477d-b69a-f24cd12d0ef8	night_owl	2025-08-23 09:15:20.665
e2747c51-e4e6-4751-820e-51394ba67e75	5a41b008-7743-477d-b69a-f24cd12d0ef8	on_the_way	2025-12-21 08:15:20.666
fe1276bd-b03f-4277-a922-deedf0d21f7f	595089e5-b503-471f-8bbb-50910e96a191	conditionals_master	2026-01-24 08:15:20.667
4826f4fa-7481-4d6f-9112-6918bc13272b	595089e5-b503-471f-8bbb-50910e96a191	level_5	2025-11-11 08:15:20.669
dbfea194-875c-49aa-a462-92f97190edf5	595089e5-b503-471f-8bbb-50910e96a191	perfect_score	2025-12-05 08:15:20.67
01f1c4c5-a48a-4095-abc6-3273d816869c	1475b0c5-e395-42d2-ba08-03b68d7a233c	first_steps	2026-01-04 08:15:20.672
6051551d-0d94-4fac-856e-5bc5f7cea682	1475b0c5-e395-42d2-ba08-03b68d7a233c	early_bird	2025-10-28 09:15:20.673
5fd031f6-7e7a-40f3-9020-db9babf4e28b	1475b0c5-e395-42d2-ba08-03b68d7a233c	perfect_score	2025-12-03 08:15:20.675
a8affa38-5405-4c72-94dd-4ce9bc028ac0	1475b0c5-e395-42d2-ba08-03b68d7a233c	variables_master	2025-09-10 09:15:20.676
152b83ce-ffe2-4222-8444-3250040243ba	1475b0c5-e395-42d2-ba08-03b68d7a233c	night_owl	2025-12-15 08:15:20.677
3881941a-6b3a-46d1-9723-5ed61ff473ed	71acdd69-48cd-4740-80d8-962b70085449	loops_master	2025-09-21 09:15:20.679
11545427-6478-46ce-af6a-05639044ddd9	71acdd69-48cd-4740-80d8-962b70085449	level_5	2025-12-08 08:15:20.681
bcdfadb3-59c0-4704-bbf2-73b24338f4bb	38c839cc-f81a-4998-8afa-aaf4ba466248	community_star	2025-10-25 09:15:20.683
d04cc4ea-ed0a-4009-aff0-0fb44c26dc52	38c839cc-f81a-4998-8afa-aaf4ba466248	conditionals_master	2025-11-17 08:15:20.684
c9f41108-5c69-47ff-bed1-7ad95d52612d	38c839cc-f81a-4998-8afa-aaf4ba466248	perfect_score	2025-09-15 09:15:20.686
5d822c87-33ed-44d3-8b13-6f90d53e106a	939a0a06-1e1a-4cb8-a6b3-6737f38d264b	dedicated_student	2025-10-15 09:15:20.688
0d5beab8-3e59-4661-89b8-d52022e0fdf7	939a0a06-1e1a-4cb8-a6b3-6737f38d264b	conditionals_master	2025-11-02 08:15:20.691
3de7d0dc-47ed-4989-ac26-95e8c3063ccf	939a0a06-1e1a-4cb8-a6b3-6737f38d264b	on_the_way	2025-11-03 08:15:20.693
488057a3-a5c9-4633-a11d-272d6ad12635	939a0a06-1e1a-4cb8-a6b3-6737f38d264b	functions_master	2025-10-20 09:15:20.695
6590f948-098e-4795-9417-3664d10207bf	b38028d8-8c4a-4c0d-8759-a79b6ed93fc1	early_bird	2025-12-25 08:15:20.696
8a154709-80e9-4917-9106-efb812c48520	b38028d8-8c4a-4c0d-8759-a79b6ed93fc1	dedicated_student	2025-08-14 09:15:20.698
5a84f087-2bee-48cb-9b95-d79280595a38	f175b7f6-7867-45ed-ab09-0fe265040bcf	on_the_way	2025-09-23 09:15:20.7
39046f7a-a4cf-4f32-a3f6-3ffc66368ae1	f175b7f6-7867-45ed-ab09-0fe265040bcf	dedicated_student	2025-10-01 09:15:20.701
b1d54c0b-bc62-4672-8dde-63801bcd9282	5cb29817-5c04-48e7-9559-4cfb26318863	early_bird	2025-08-25 09:15:20.703
e30fc708-27bd-47f9-8fd3-b0996becbd07	5cb29817-5c04-48e7-9559-4cfb26318863	speed_demon	2025-12-14 08:15:20.704
d906cd09-52d9-4599-ae7f-2c3ebc4c3a48	5cb29817-5c04-48e7-9559-4cfb26318863	variables_master	2025-12-09 08:15:20.706
846075bf-4501-40c7-9c1c-58ac150e6191	07c79298-6724-4826-934c-0c0693e8f51a	dedicated_student	2025-10-02 09:15:20.708
92d7c5ee-c540-43aa-9b3f-91f445b6073c	07c79298-6724-4826-934c-0c0693e8f51a	conditionals_master	2025-09-28 09:15:20.71
356f21b5-ee0e-419e-8853-c836b0e77c8f	07c79298-6724-4826-934c-0c0693e8f51a	functions_master	2025-10-11 09:15:20.711
e3ac1ea6-721b-415f-9f3f-05a68576d540	07c79298-6724-4826-934c-0c0693e8f51a	on_the_way	2025-08-16 09:15:20.713
b291ae1a-2dfa-4a7d-a5d0-33a5c5993123	07c79298-6724-4826-934c-0c0693e8f51a	speed_demon	2026-01-27 08:15:20.715
d19ec62c-29de-4b37-8021-989c3f7544bb	d0deb68d-283f-465f-9c10-211a4742a34e	level_5	2026-01-15 08:15:20.716
d7c23705-00d1-4816-bccb-bad67967b491	91fb42f5-a87c-4ec0-97bd-2ca1fc3eff88	variables_master	2025-10-11 09:15:20.717
2522e111-a34a-4b86-9d7c-8af885c26a22	91fb42f5-a87c-4ec0-97bd-2ca1fc3eff88	on_the_way	2026-01-29 08:15:20.719
4651444c-0efb-4f2f-aead-10983910a244	f72c60c1-cba6-4b45-b182-49b3b4a3e651	early_bird	2025-11-10 08:15:20.721
98ac0115-11ed-419e-9f14-751740d2b7fe	f72c60c1-cba6-4b45-b182-49b3b4a3e651	on_the_way	2025-08-20 09:15:20.723
b71bdcc5-3b9d-40fa-b1c1-29e03c5efbc1	4338aa7b-9826-4c1f-8cf5-7d0a5331d4a2	loops_master	2025-08-09 09:15:20.724
00ccaf4d-fc1f-4351-83af-1716c0dfaaa8	cdfff534-6c77-4db1-a2f2-faa601ad48eb	level_5	2025-10-13 09:15:20.725
31a4fdc7-5c71-49f0-8e33-ea66d7d15396	3909ff1e-c321-480c-95e1-0176ffe923bb	level_5	2026-01-05 08:15:20.727
db763844-6060-4359-960b-5066dedb7b48	ea32ea39-a33f-49cc-af13-04804ae4dfa0	speed_demon	2025-11-28 08:15:20.73
2fc1598c-3e94-4ab5-926d-d9ececee3169	ae59a5c3-cd8a-4a6d-8481-e7a56bc62151	dedicated_student	2026-01-06 08:15:20.731
89fb048f-88ab-4ec9-ae2c-32fc1ac3e500	ae59a5c3-cd8a-4a6d-8481-e7a56bc62151	first_steps	2026-01-11 08:15:20.733
93ae9cdb-f2bd-492c-8b76-568dc8522e05	8a1e0004-0a71-42b7-89ef-71bad6479a9e	variables_master	2025-10-12 09:15:20.735
ef7c17b4-9593-4e3d-979a-04722b48b539	8c63e328-754f-41b3-96b2-febcc8db78f1	perfect_score	2025-12-22 08:15:20.736
d20a8670-3187-4691-9b3c-0252aedfcdd9	8c63e328-754f-41b3-96b2-febcc8db78f1	functions_master	2025-09-17 09:15:20.738
4e9accb7-89fb-4db4-be24-6e39c8931190	090ee80d-5929-4486-945c-104600e2b757	night_owl	2025-09-27 09:15:20.739
f43472ae-c937-47bc-8f0d-66c90df52c96	090ee80d-5929-4486-945c-104600e2b757	dedicated_student	2025-08-25 09:15:20.741
7d568dab-3396-4afc-8e75-7815a35217be	15aec74c-1343-4c15-a58d-887b6a06b1f3	on_the_way	2025-12-09 08:15:20.743
33748142-8b8b-420c-ae55-6cce2867d9a1	ec253d46-469a-4ab5-baa1-16ca991871c5	on_the_way	2025-12-02 08:15:20.744
1872b3d1-8210-4842-8c86-65c338d42a4e	bcf553c4-58ee-410f-a74d-d5d9370b0dde	level_10	2025-10-04 09:15:20.746
5934cef8-5313-4f83-ba95-ee1d350adadf	bcf553c4-58ee-410f-a74d-d5d9370b0dde	functions_master	2025-09-10 09:15:20.747
8f842d61-9b6d-43c0-911d-c152e10d7717	99c9a347-c807-45d1-ae17-1b98989b11d5	level_5	2025-09-17 09:15:20.749
004301ad-57c0-4f25-a931-8dfdb5ef7298	67475aa3-0f09-47e2-8f7a-4e7fa35a94fb	first_steps	2025-09-15 09:15:20.75
58d2a520-f83a-445e-9eb8-5cb9944d2bd8	67475aa3-0f09-47e2-8f7a-4e7fa35a94fb	conditionals_master	2026-01-08 08:15:20.751
25f0949a-2067-4783-8c5a-f2057cb91090	917efd28-bbfe-4c3f-bf93-4af3e5c2c31e	first_steps	2026-01-26 08:15:20.753
5c727c07-bc70-4f2c-90f3-bfdc356e2730	f7b55a67-e41f-4c48-902c-0ea858cd13be	night_owl	2026-01-11 08:15:20.755
8a111c17-4394-4f21-9c80-64df1529d41a	f7b55a67-e41f-4c48-902c-0ea858cd13be	on_the_way	2026-01-13 08:15:20.757
7614dace-c25f-4d8d-bdaa-adbff635896f	0587db93-4151-4825-8cbf-d96e5893212b	conditionals_master	2025-10-09 09:15:20.758
0c46ed95-91d2-4101-b26b-869347404e03	0587db93-4151-4825-8cbf-d96e5893212b	community_star	2025-12-19 08:15:20.759
efb8913e-9874-498d-970b-7ba4e34289fd	48187149-2343-4ede-9d45-9ec29279dfd2	level_5	2025-10-26 09:15:20.761
3c501fc1-e4e5-49f3-9285-81de3ee9ebbd	48187149-2343-4ede-9d45-9ec29279dfd2	community_star	2025-11-22 08:15:20.762
3917e140-fa56-47c5-8cda-ebf9c98f92e2	33d891e5-c4e9-4caa-bd27-f66e6cfb37a3	functions_master	2025-08-17 09:15:20.764
5a2659ef-876b-41f5-becd-205e36e66b91	33d891e5-c4e9-4caa-bd27-f66e6cfb37a3	loops_master	2026-01-05 08:15:20.765
f06c2cc2-e6cb-4de5-8042-cee89d9b3665	90166457-241e-46a6-bd4b-1a19d8bfe12a	functions_master	2025-11-20 08:15:20.766
1c3663b4-d6d8-42ac-96bf-415b7dd75ff5	e83739b5-9a5b-43a0-853a-f02ef6abc694	first_steps	2025-08-31 09:15:20.768
7935e491-3123-4b9f-9fb0-05d8c6036a9a	55ba721f-044e-4dd1-94a5-3de7dedd3bae	perfect_score	2025-10-08 09:15:20.77
8a56a3cf-6288-44b0-b1ed-33710d383bc1	79909d3c-4b0e-4a92-88fd-41b147c0ff27	community_star	2025-11-18 08:15:20.771
6c07ff7e-602e-4541-9dbb-b5d20d04e2a5	79909d3c-4b0e-4a92-88fd-41b147c0ff27	night_owl	2026-01-05 08:15:20.773
d9483aaf-c8a0-4e0f-a9f0-0fff765de4ea	f2d3c142-53b9-4641-9682-90b34edd5154	level_5	2025-10-10 09:15:20.775
3a4798ee-d71d-45d7-a581-669c36f0f747	f2d3c142-53b9-4641-9682-90b34edd5154	on_the_way	2025-10-04 09:15:20.777
22f0e224-2e53-4d70-b22c-c31021feb7d0	62c61c87-6e44-4d1e-b891-5a637c989a03	level_5	2025-12-30 08:15:20.778
deb644af-bc21-43af-abe7-de87de4dc64c	d279d4a9-1412-4a74-a40b-44954082a13c	persistent	2026-01-12 08:15:20.78
4e4c1ce3-3898-419f-8172-9d8f18d7b5a6	92472c64-e07d-4692-b1a5-618eec89121a	night_owl	2026-01-20 08:15:20.782
f0fc9f87-cab1-45ef-9ac5-1d8b78cefd34	92472c64-e07d-4692-b1a5-618eec89121a	early_bird	2025-10-23 09:15:20.784
25c7d6b1-7ef9-4f0f-9328-b4c2f22cbd28	f9b29a1f-0ca4-4839-a144-388964c66555	persistent	2025-09-10 09:15:20.785
8cc5d0ed-2dbe-4423-9fc6-9326bd7022a6	a7b7f687-3168-4b5b-b01c-acfef742da8a	dedicated_student	2025-12-01 08:15:20.787
7f276350-532b-49ca-a161-28eaa642cc8e	a7b7f687-3168-4b5b-b01c-acfef742da8a	conditionals_master	2025-08-25 09:15:20.788
e9225822-9421-4101-bebb-7ef0ba857119	ce7ce853-42a6-4b2c-b1ac-3f657dcbbf6b	level_10	2025-10-26 09:15:20.79
86a3b084-005e-4a8f-8044-9ae740f435e6	ce7ce853-42a6-4b2c-b1ac-3f657dcbbf6b	variables_master	2025-12-21 08:15:20.791
9379f5cd-cde3-4b61-b480-4d57ec600b29	66e331b4-7b4b-42a6-b0be-532332292f1b	level_10	2025-09-18 09:15:20.793
ba6b201f-62d6-4b03-b219-ee9c913cb22d	66e331b4-7b4b-42a6-b0be-532332292f1b	level_5	2025-12-15 08:15:20.794
20480a84-04bf-4992-84d6-91e197e24dc2	e7c55ea4-ee93-4b5a-8410-e27c6e65483b	on_the_way	2025-08-04 09:15:20.796
a8edec24-b086-4309-be3b-3138d1a47034	e7c55ea4-ee93-4b5a-8410-e27c6e65483b	dedicated_student	2025-09-14 09:15:20.797
67e494e6-0991-44fe-b167-79dcddd0a4a4	3db48db7-c6d9-43cf-8be1-a94392b362db	first-steps	2026-02-03 16:11:39.175
06ea7af0-38e0-4d55-a74c-35207a6356a4	3db48db7-c6d9-43cf-8be1-a94392b362db	getting-started	2026-02-03 16:15:23.521
ac425b21-43d7-446c-96e4-49d51019411b	3db48db7-c6d9-43cf-8be1-a94392b362db	variables-master	2026-02-03 16:16:40.451
f0f6f12c-cbd0-4e03-8ddd-51adf8729f38	5086d4a7-519a-4496-9938-ee343f38861f	first-steps	2026-02-13 20:33:33.268266
f1bfedfc-7b30-49f7-a849-10f64bfd558d	5086d4a7-519a-4496-9938-ee343f38861f	getting-started	2026-02-13 20:36:55.784082
4c47247d-06f4-44ea-b91f-aebe5d373dbe	5086d4a7-519a-4496-9938-ee343f38861f	variables-master	2026-02-13 20:37:42.469854
dec2fc8d-9506-4ac3-8010-fabaf304f18a	5086d4a7-519a-4496-9938-ee343f38861f	level-5	2026-02-20 16:57:17.346556
61ebc00a-3fc8-4ed1-9b49-a783aa2dbc78	5086d4a7-519a-4496-9938-ee343f38861f	challenges-1	2026-03-18 18:08:49.784753
a6be1784-988c-4cd8-92b0-080ffe0735f3	5086d4a7-519a-4496-9938-ee343f38861f	dedicated-learner	2026-03-18 18:09:27.712335
a9441a3c-cfc6-46ac-99fc-4fb16d0c1eaf	5086d4a7-519a-4496-9938-ee343f38861f	speed-demon	2026-03-19 13:41:30.905565
708f8232-4c52-4325-b7a2-9d94865eb33a	5086d4a7-519a-4496-9938-ee343f38861f	streak-3	2026-03-20 15:03:42.028871
\.


--
-- Data for Name: user_challenge_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_challenge_progress (id, user_id, challenge_id, completed_at, best_execution_time_ms, attempts, best_execution_code) FROM stdin;
90cb3c62-43bf-4241-88d2-97c40192bf45	5086d4a7-519a-4496-9938-ee343f38861f	de3bc42b-0c3a-4b0b-bdfd-7940b721c420	2026-03-01 02:31:13.89594	0.000	1	\N
23ff71d0-f9c8-4da9-aee2-72ae91894543	5086d4a7-519a-4496-9938-ee343f38861f	2302c7ce-3368-41e0-ad8e-c85080ebc8c0	2026-03-01 02:42:12.828164	0.000	1	\N
\.


--
-- Data for Name: user_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_progress (id, user_id, exercise_id, completed_at, attempts) FROM stdin;
002cd6e6-16c2-4ad2-9398-25ef0ad44146	5086d4a7-519a-4496-9938-ee343f38861f	2eab7f99-8268-4166-b81d-67bc693623bd	2026-02-13 20:33:33.237649	2
32d6b01e-0b89-4d00-9239-aefec8824d24	5086d4a7-519a-4496-9938-ee343f38861f	b6d5863a-b427-4baa-9516-44b2166001e9	2026-02-13 20:35:23.437417	1
4a0cbe38-22fe-4a09-8716-08bce874f3e2	5086d4a7-519a-4496-9938-ee343f38861f	1fdc5c6a-6c28-4d84-a100-be6b6bb4e94b	2026-02-13 20:35:33.157239	1
5ef1c2e8-40bb-4ea5-bfe1-ae7101b98a4b	5086d4a7-519a-4496-9938-ee343f38861f	5414c287-b691-4485-a701-c072a74d0886	2026-02-13 20:36:50.938879	1
6630edb3-e14b-4f3f-a8a2-9813c58d8d9c	5086d4a7-519a-4496-9938-ee343f38861f	578009d0-29ca-4263-9595-7ee7bf19fa4e	2026-02-13 20:36:55.767233	1
7e8d86f8-284f-4689-9adf-40196f2e973b	5086d4a7-519a-4496-9938-ee343f38861f	d2d8955b-5621-487b-b2ff-8f458fd2be8e	2026-02-13 20:37:00.746258	1
e3679b9a-4b3f-4e2f-af0d-177d1ddb7e36	5086d4a7-519a-4496-9938-ee343f38861f	1fbe6b58-3e49-44a9-8c92-001b613c0be4	2026-02-13 20:37:42.442199	1
2a84f526-8c0f-4055-8913-911add03d773	5086d4a7-519a-4496-9938-ee343f38861f	1bbc93c9-ae8a-4c48-b536-669b561295a8	2026-02-13 20:49:54.927532	1
03a6621a-2395-4424-b9c7-213afae1c213	5086d4a7-519a-4496-9938-ee343f38861f	4ccc0c66-dcc9-466c-87c6-9f272a79a31c	2026-02-20 16:57:17.315735	1
8498d8eb-c871-4729-95d9-9e347f5e2bed	5086d4a7-519a-4496-9938-ee343f38861f	3a9e5c9d-0c92-424d-80ab-9fbfa55099de	2026-02-20 16:57:46.226848	1
e7b162e4-34ee-460a-93cd-b39c0ed7e95d	5086d4a7-519a-4496-9938-ee343f38861f	332eb48c-3fca-4ab5-bbf1-e10c045b34af	2026-02-20 16:57:59.573246	2
8353b361-0456-4759-8956-d20597112c0b	5086d4a7-519a-4496-9938-ee343f38861f	ccbb2ae9-7308-437f-bfdf-ffdd1a87f71c	2026-03-02 15:29:45.750082	1
eacdc0e3-214d-436a-affa-9b68e3365304	5086d4a7-519a-4496-9938-ee343f38861f	201e6008-a2b9-4327-8e36-2ba85c18f758	2026-03-18 18:06:42.598545	2
663096fe-47af-427d-996a-f774ee82190f	5086d4a7-519a-4496-9938-ee343f38861f	01c0a0a9-75d4-4312-929f-36c81b7a0fdc	2026-03-18 18:08:49.70956	2
2b2093d1-cf78-495a-ba78-c990c3efe94e	5086d4a7-519a-4496-9938-ee343f38861f	e34d843c-6c31-402b-8fba-a3713ef24317	2026-03-18 18:09:27.666378	1
f43005f1-9b26-4f07-821c-8bec6df35de4	5086d4a7-519a-4496-9938-ee343f38861f	450abbfe-dfc7-4913-aebf-9ecbacbf4610	2026-03-19 13:41:30.855585	1
7fec54ec-c686-4b0e-b590-9852966e91bd	5086d4a7-519a-4496-9938-ee343f38861f	b87a039e-c679-4cc1-9862-e90ccc7cb00e	2026-03-19 13:41:43.350138	2
6889d975-e777-45c5-bd2e-eed065ef6361	5086d4a7-519a-4496-9938-ee343f38861f	da16145d-c4f4-4122-9186-b70206ed167c	2026-03-20 15:03:41.935299	1
61b87384-6365-47a9-b82a-0328baa3240a	5086d4a7-519a-4496-9938-ee343f38861f	bb1f28b1-7a6d-4525-862b-c015fe83ca91	2026-03-20 15:04:51.314876	1
9cb76835-68be-4784-a47b-b0f5714aa195	5086d4a7-519a-4496-9938-ee343f38861f	3d3db0bb-5a71-4663-a27b-88c1c528dfc0	2026-03-20 15:05:01.54847	2
\.


--
-- Data for Name: user_skill_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_skill_progress (id, user_id, node_id, status, progress_percent, unlocked_at, completed_at) FROM stdin;
cdeb107b-9af3-4e0d-9dbe-01a00a858f61	5086d4a7-519a-4496-9938-ee343f38861f	8aa92ad7-e049-4186-8006-d70b69d52a76	completed	100	2026-03-23 18:51:18.521	2026-03-23 18:51:18.521
1e3a484a-f958-4660-bda1-04579dde6cba	5086d4a7-519a-4496-9938-ee343f38861f	d96755f4-967d-40e6-8809-5bcf05427e7f	completed	100	2026-03-23 18:51:18.524	2026-03-23 18:51:18.524
5bf32d6b-8437-4bc2-bef3-4632878ff0b3	5086d4a7-519a-4496-9938-ee343f38861f	04f5da57-2d11-4963-94cc-29696e2c188e	completed	100	2026-03-23 18:51:18.529	2026-03-23 18:51:18.529
0f1ed7e8-067b-4dde-822e-1278bebd8e60	5086d4a7-519a-4496-9938-ee343f38861f	e0a52c12-072a-4e46-8468-934add6e0e6e	in_progress	67	2026-03-23 18:51:18.532	\N
\.


--
-- Data for Name: user_streaks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_streaks (id, user_id, current_streak, longest_streak, last_activity_date, streak_start_date, created_at, updated_at) FROM stdin;
bbd2684c-34bb-4da7-b4f2-7c52da038009	5086d4a7-519a-4496-9938-ee343f38861f	3	3	2026-03-20	2026-03-18	2026-03-18 18:06:42.63205	2026-03-20 15:03:41.96429
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, xp, level, is_public, bio, github, linkedin, twitter, website, avatar_url, created_at, "authProvider", "providerId", avatar, updated_at, league) FROM stdin;
27a7b508-cfef-4e86-a91c-1cbb6ef7d556	TechNinja	techninja@test.com	3340	7	t	Self-taught developer on a mission	techninja	\N	\N	\N	\N	2025-08-24 08:57:49.366	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
dcbd21e4-2164-4f08-b560-e3e06c906b12	PixelCoder	pixelcoder@test.com	2506	6	t	Apasionado por la programación y el open source	\N	\N	\N	\N	\N	2025-03-17 08:57:49.373	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
2f8e040e-fdce-4d63-908b-7d290e6c7ed1	AlgoExpert	algoexpert@test.com	391	1	t	DevOps engineer in training	\N	\N	\N	\N	\N	2025-09-16 08:57:49.381	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
ba870ced-b54a-42e1-93bf-9bf0df99d544	CyberPunk	cyberpunk@test.com	715	2	t	Apasionado por la programación y el open source	\N	\N	\N	\N	\N	2025-02-18 07:57:49.401	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
238b9dac-2644-427e-8bd2-ed4c3abb8890	StackOverflow	stackoverflow@test.com	1514	4	t	Debugging my way through life	\N	\N	\N	\N	\N	2025-08-20 08:57:49.413	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
6f2a0c6d-6e90-4cd6-8774-abd9c722c6b4	ReactRanger	reactranger@test.com	244	1	t	Learning to code everyday! 🚀	\N	\N	\N	\N	\N	2025-04-04 08:57:49.418	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
b96b833c-b88d-40f6-80df-146bdd457983	PythonMaster	pythonmaster@test.com	826	2	t	Learning to code everyday! 🚀	\N	\N	\N	\N	\N	2025-06-12 08:57:49.426	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
484180d6-851b-461b-9995-07d3e3fb0116	RustLord	rustlord@test.com	1974	4	t	Data Science enthusiast | ML lover	\N	\N	\N	\N	\N	2025-08-21 08:57:49.432	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
cf7c11a7-a38d-4241-81ff-180548d5f270	NodeNinja	nodeninja@test.com	1579	4	t	Making the web a better place	nodeninja	\N	\N	\N	\N	2025-03-30 08:57:49.439	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
5a8e03d7-2b9b-4330-b28a-a64d9ea31629	HTMLHero	htmlhero@test.com	1774	4	t	Backend enthusiast | API lover	htmlhero	\N	\N	\N	\N	2025-09-26 08:57:49.446	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
4b1c2adf-90d0-48e2-a40e-3950a4ce2a83	KubeKing	kubeking@test.com	1948	4	t	Algorithms and data structures lover	\N	\N	\N	\N	\N	2025-10-16 08:57:49.456	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
b6afb299-43be-4bc6-86ee-434584f5f0a2	CloudCrafter	cloudcrafter@test.com	103	1	t	Backend enthusiast | API lover	cloudcrafter	\N	\N	\N	\N	2025-07-17 08:57:49.461	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
03022b17-5967-486d-818e-85a2b71056d5	DBDragon	dbdragon@test.com	1274	3	t	Breaking things to learn how they work	dbdragon	\N	\N	\N	\N	2025-10-12 08:57:49.471	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
50b2fd75-14de-406c-9db1-e61588b96068	GitGuru	gitguru@test.com	341	1	t	Tech lover and eternal learner	\N	\N	\N	\N	\N	2025-04-07 08:57:49.478	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
595089e5-b503-471f-8bbb-50910e96a191	VimVanguard	vimvanguard@test.com	864	2	f	\N	vimvanguard	\N	\N	\N	\N	2025-07-23 08:57:49.486	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
1475b0c5-e395-42d2-ba08-03b68d7a233c	EmacsMaster	emacsmaster@test.com	1473	3	t	Code is poetry 📝	emacsmaster	\N	\N	\N	\N	2025-09-04 08:57:49.49	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
38c839cc-f81a-4998-8afa-aaf4ba466248	TerminalTitan	terminaltitan@test.com	1471	3	t	Turned caffeine into code since 2020	terminaltitan	\N	\N	\N	\N	2025-02-19 07:57:49.498	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
939a0a06-1e1a-4cb8-a6b3-6737f38d264b	BugBuster	bugbuster@test.com	1014	3	f	Code artisan crafting digital experiences	\N	\N	\N	\N	\N	2025-05-17 08:57:49.503	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
5cb29817-5c04-48e7-9559-4cfb26318863	CleanCoder	cleancoder@test.com	1620	4	t	Making the web a better place	cleancoder	\N	\N	\N	\N	2025-08-04 08:57:49.516	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
07c79298-6724-4826-934c-0c0693e8f51a	AgileAce	agileace@test.com	468	1	f	From zero to hero in programming	\N	\N	\N	\N	\N	2025-03-15 08:57:49.52	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
e9239df4-f49b-4f39-b349-252180ecf387	ScrumSamurai	scrumsamurai@test.com	1836	4	t	Self-taught developer on a mission	scrumsamurai	\N	\N	\N	\N	2026-01-25 07:57:49.524	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
312d7038-0402-4693-8c0e-5c7fedf8519f	MLMaven	mlmaven@test.com	549	2	t	Coffee → Code → Repeat ☕	\N	\N	\N	\N	\N	2026-01-23 07:57:49.531	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
f72c60c1-cba6-4b45-b182-49b3b4a3e651	DataDriller	datadriller@test.com	1668	4	t	Algorithms and data structures lover	\N	\N	\N	\N	\N	2025-11-25 07:57:49.537	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
184e24f5-5cb4-4cc0-b562-addee57f91cc	SmartContract	smartcontract@test.com	1861	4	f	Algorithms and data structures lover	\N	\N	\N	\N	\N	2025-11-07 07:57:49.547	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
3909ff1e-c321-480c-95e1-0176ffe923bb	DeFiDev	defidev@test.com	557	2	f	Building apps that matter	defidev	\N	\N	\N	\N	2025-04-06 08:57:49.554	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
ae59a5c3-cd8a-4a6d-8481-e7a56bc62151	UnityUnicorn	unityunicorn@test.com	200	1	t	Building apps that matter	unityunicorn	\N	\N	\N	\N	2025-12-09 07:57:49.561	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
8a1e0004-0a71-42b7-89ef-71bad6479a9e	UnrealUltra	unrealultra@test.com	320	1	t	Data Science enthusiast | ML lover	\N	\N	\N	\N	\N	2025-08-16 08:57:49.565	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
090ee80d-5929-4486-945c-104600e2b757	ShaderSage	shadersage@test.com	497	1	t	Building apps that matter	shadersage	\N	\N	\N	\N	2025-11-10 07:57:49.572	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
4122c870-8a2d-4191-a4aa-fbf19fdaac1a	SwiftSword_51	swiftsword@test.com	419	1	f	Turned caffeine into code since 2020	swiftsword	\N	\N	\N	\N	2025-07-23 08:57:49.58	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
15aec74c-1343-4c15-a58d-887b6a06b1f3	MobileMaster_50	mobilemaster@test.com	1100	3	t	Algorithms and data structures lover	mobilemaster	\N	\N	\N	\N	2025-05-24 08:57:49.575	\N	\N	\N	2026-02-10 17:40:27.431356	diamond
ec253d46-469a-4ab5-baa1-16ca991871c5	KotlinKnight_52	kotlinknight@test.com	569	2	t	\N	kotlinknight	\N	\N	\N	\N	2025-11-14 07:57:49.583	\N	\N	\N	2026-02-10 17:40:27.431356	gold
40540771-bd01-477e-9bd9-1a97e9791fd1	CodeMaster	codemaster@test.com	3791	8	t	Solving problems one commit at a time	codemaster	\N	\N	\N	\N	2025-06-19 08:57:49.331	\N	\N	\N	2026-02-10 17:40:27.431356	gold
f2833746-a709-416f-b755-7efdf87e3ac5	ByteRunner	byterunner@test.com	2354	5	t	Making the web a better place	\N	\N	\N	\N	\N	2025-11-27 07:57:49.377	\N	\N	\N	2026-02-10 17:40:27.431356	gold
84fa5ae9-2b10-4102-83b0-391accda9aba	WebHero	webhero@test.com	500	2	t	Obsessed with clean, efficient code	\N	\N	\N	\N	\N	2025-04-26 08:57:49.385	\N	\N	\N	2026-02-10 17:40:27.431356	diamond
9f8dd3c6-3a70-4541-94a6-a4ea9ce5c5ce	DevNewbie	devnewbie@test.com	1952	4	t	Making the web a better place	devnewbie	\N	\N	\N	\N	2025-12-30 07:57:49.39	\N	\N	\N	2026-02-10 17:40:27.431356	gold
5120f1c6-507e-4a5b-aa9f-53241f3a2b9b	TypeScriptKing	typescriptking@test.com	785	2	t	Learning to code everyday! 🚀	\N	\N	\N	\N	\N	2025-04-17 08:57:49.422	\N	\N	\N	2026-02-10 17:40:27.431356	gold
eb7f7b5a-e424-4faa-87ba-ff4d35c81cc4	JavaJunkie	javajunkie@test.com	1787	4	t	Self-taught developer on a mission	javajunkie	\N	\N	\N	\N	2025-12-14 07:57:49.429	\N	\N	\N	2026-02-10 17:40:27.431356	diamond
2f1ccf7a-022a-4f35-befc-7b401c50aa38	GoGopher	gogopher@test.com	1463	3	t	Data Science enthusiast | ML lover	\N	\N	\N	\N	\N	2025-04-24 08:57:49.436	\N	\N	\N	2026-02-10 17:40:27.431356	gold
0566f71b-c470-4fd6-9223-79ec9b266a9b	CSSWizard	csswizard@test.com	1579	4	t	Algorithms and data structures lover	\N	\N	\N	\N	\N	2025-06-13 08:57:49.442	\N	\N	\N	2026-02-10 17:40:27.431356	diamond
6e69e1f1-2d77-49da-bc84-62f12a401fdb	DockerDude	dockerdude@test.com	96	1	t	Turned caffeine into code since 2020	dockerdude	\N	\N	\N	\N	2025-12-28 07:57:49.451	\N	\N	\N	2026-02-10 17:40:27.431356	gold
444cd236-b686-4c61-87c9-2a9e87933d7b	APIArchitect	apiarchitect@test.com	987	2	t	Backend enthusiast | API lover	apiarchitect	\N	\N	\N	\N	2025-06-17 08:57:49.465	\N	\N	\N	2026-02-10 17:40:27.431356	gold
5a41b008-7743-477d-b69a-f24cd12d0ef8	LinuxLover	linuxlover@test.com	1766	4	t	Making the web a better place	linuxlover	\N	\N	\N	\N	2026-01-19 07:57:49.482	\N	\N	\N	2026-02-10 17:40:27.431356	gold
71acdd69-48cd-4740-80d8-962b70085449	VSCodeVet	vscodevet@test.com	722	2	t	Building the future, one line at a time	vscodevet	\N	\N	\N	\N	2025-06-29 08:57:49.494	\N	\N	\N	2026-02-10 17:40:27.431356	diamond
b38028d8-8c4a-4c0d-8759-a79b6ed93fc1	TestTamer	testtamer@test.com	645	2	t	\N	testtamer	\N	\N	\N	\N	2025-04-06 08:57:49.506	\N	\N	\N	2026-02-10 17:40:27.431356	gold
f175b7f6-7867-45ed-ab09-0fe265040bcf	RefactorRex	refactorrex@test.com	1295	3	t	Cloud computing aficionado ☁️	refactorrex	\N	\N	\N	\N	2025-05-31 08:57:49.509	\N	\N	\N	2026-02-10 17:40:27.431356	diamond
91fb42f5-a87c-4ec0-97bd-2ca1fc3eff88	AIArtist	aiartist@test.com	1837	4	t	Solving problems one commit at a time	aiartist	\N	\N	\N	\N	2025-03-30 08:57:49.534	\N	\N	\N	2026-02-10 17:40:27.431356	gold
72939137-da8b-456c-834b-2a9753bbe1ba	BlockchainBoss	blockchainboss@test.com	1983	4	t	Making the web a better place	blockchainboss	\N	\N	\N	\N	2025-07-07 08:57:49.54	\N	\N	\N	2026-02-10 17:40:27.431356	diamond
4338aa7b-9826-4c1f-8cf5-7d0a5331d4a2	CryptoKid	cryptokid@test.com	1007	3	t	Passionate about UI/UX and beautiful code	cryptokid	\N	\N	\N	\N	2025-02-09 07:57:49.543	\N	\N	\N	2026-02-10 17:40:27.431356	diamond
cdfff534-6c77-4db1-a2f2-faa601ad48eb	Web3Warrior	web3warrior@test.com	419	1	t	Full Stack Developer | React & Node.js	\N	\N	\N	\N	\N	2025-12-03 07:57:49.551	\N	\N	\N	2026-02-10 17:40:27.431356	gold
ea32ea39-a33f-49cc-af13-04804ae4dfa0	GameDev	gamedev@test.com	1038	3	t	Code is poetry 📝	gamedev	\N	\N	\N	\N	2025-07-13 08:57:49.558	\N	\N	\N	2026-02-10 17:40:27.431356	diamond
bcf553c4-58ee-410f-a74d-d5d9370b0dde	FlutterFan_53	flutterfan@test.com	795	2	f	Debugging my way through life	flutterfan	\N	\N	\N	\N	2025-08-17 08:57:49.586	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
99c9a347-c807-45d1-ae17-1b98989b11d5	DartDancer_54	dartdancer@test.com	1677	4	t	Data Science enthusiast | ML lover	\N	\N	\N	\N	\N	2025-11-03 07:57:49.59	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
67475aa3-0f09-47e2-8f7a-4e7fa35a94fb	SecureScout_55	securescout@test.com	294	1	t	\N	\N	\N	\N	\N	\N	2025-04-12 08:57:49.594	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
917efd28-bbfe-4c3f-bf93-4af3e5c2c31e	PenTester_57	pentester@test.com	1256	3	t	From zero to hero in programming	pentester	\N	\N	\N	\N	2025-05-08 08:57:49.601	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
0587db93-4151-4825-8cbf-d96e5893212b	CryptoGuard_59	cryptoguard@test.com	1938	4	t	Junior dev with senior dreams	cryptoguard	\N	\N	\N	\N	2026-01-17 07:57:49.607	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
b2e33f04-354c-4b61-9db1-72d4cb2bf07c	BackendBeast_61	backendbeast@test.com	287	1	f	Junior dev with senior dreams	\N	\N	\N	\N	\N	2025-11-03 07:57:49.613	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
deaa1ab2-4d52-4cb4-a36b-fcc583b99992	FrontendFlash_62	frontendflash@test.com	1524	4	t	Tech lover and eternal learner	\N	\N	\N	\N	\N	2025-08-16 08:57:49.616	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
90166457-241e-46a6-bd4b-1a19d8bfe12a	APIPro_64	apipro@test.com	455	1	t	Debugging my way through life	apipro	\N	\N	\N	\N	2025-10-15 08:57:49.642	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
5b8d59f9-35b5-4ec3-aca1-1573faf85f67	DebugDemon_66	debugdemon@test.com	1552	4	t	Copy-paste expert 😅	debugdemon	\N	\N	\N	\N	2025-08-07 08:57:49.649	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
55ba721f-044e-4dd1-94a5-3de7dedd3bae	SyntaxSavant_67	syntaxsavant@test.com	1067	3	t	Backend enthusiast | API lover	syntaxsavant	\N	\N	\N	\N	2025-07-27 08:57:49.652	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
f2d3c142-53b9-4641-9682-90b34edd5154	BinaryBoss_69	binaryboss@test.com	1801	4	t	Tech lover and eternal learner	binaryboss	\N	\N	\N	\N	2025-08-08 08:57:49.66	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
1ad14a3d-0f96-411e-a103-a0ec4dafe480	BitBender_71	bitbender@test.com	79	1	t	Copy-paste expert 😅	bitbender	\N	\N	\N	\N	2025-08-01 08:57:49.668	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
92472c64-e07d-4692-b1a5-618eec89121a	TypeChecker_73	typechecker@test.com	1827	4	t	Apasionado por la programación y el open source	typechecker	\N	\N	\N	\N	2025-11-17 07:57:49.676	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
f9b29a1f-0ca4-4839-a144-388964c66555	LintLion_74	lintlion@test.com	1477	3	t	Passionate about UI/UX and beautiful code	lintlion	\N	\N	\N	\N	2025-04-03 08:57:49.678	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
a7b7f687-3168-4b5b-b01c-acfef742da8a	CacheCaptain_75	cachecaptain@test.com	1817	4	t	Junior dev with senior dreams	\N	\N	\N	\N	\N	2025-03-06 07:57:49.681	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
ce7ce853-42a6-4b2c-b1ac-3f657dcbbf6b	MemoryMaster_76	memorymaster@test.com	766	2	t	Coffee → Code → Repeat ☕	memorymaster	\N	\N	\N	\N	2025-04-09 08:57:49.685	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
66e331b4-7b4b-42a6-b0be-532332292f1b	ThreadThrasher_77	threadthrasher@test.com	1829	4	t	Code artisan crafting digital experiences	\N	\N	\N	\N	\N	2025-11-18 07:57:49.688	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
e7c55ea4-ee93-4b5a-8410-e27c6e65483b	ParallelPro_79	parallelpro@test.com	64	1	t	Code is poetry 📝	parallelpro	\N	\N	\N	\N	2025-11-19 07:57:49.696	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
a578abf1-5bf5-420c-9119-2570b930a57c	test1	test1@test.com	0	1	t	\N	\N	\N	\N	\N	\N	2026-01-31 13:38:46.758994	\N	\N	\N	2026-02-10 17:40:27.431356	bronze
fde32463-d342-4cc0-8e8c-1845ce2162b7	user_a3f95751	gsdfdsfdsf@gmail.com	0	1	t	\N	\N	\N	\N	\N	\N	2026-03-14 12:06:30.458194	email	\N	\N	2026-03-14 12:06:30.458194	bronze
e83739b5-9a5b-43a0-853a-f02ef6abc694	CodeCrusader_65	codecrusader@test.com	1307	3	t	Junior dev with senior dreams	\N	\N	\N	\N	\N	2025-12-28 07:57:49.645	\N	\N	\N	2026-02-10 17:40:27.431356	diamond
79909d3c-4b0e-4a92-88fd-41b147c0ff27	LogicLord_68	logiclord@test.com	1146	3	t	Data Science enthusiast | ML lover	\N	\N	\N	\N	\N	2025-10-25 08:57:49.657	\N	\N	\N	2026-02-10 17:40:27.431356	diamond
62c61c87-6e44-4d1e-b891-5a637c989a03	HexHacker_70	hexhacker@test.com	612	2	t	Algorithms and data structures lover	hexhacker	\N	\N	\N	\N	2025-06-18 08:57:49.664	\N	\N	\N	2026-02-10 17:40:27.431356	diamond
d279d4a9-1412-4a74-a40b-44954082a13c	NullKiller_72	nullkiller@test.com	837	2	t	\N	\N	\N	\N	\N	\N	2025-03-01 07:57:49.672	\N	\N	\N	2026-02-10 17:40:27.431356	gold
6612a331-2296-4356-9611-a2c836fadf7e	AsyncAce_78	asyncace@test.com	970	2	t	Building the future, one line at a time	asyncace	\N	\N	\N	\N	2025-08-11 08:57:49.692	\N	\N	\N	2026-02-10 17:40:27.431356	gold
5086d4a7-519a-4496-9938-ee343f38861f	user_fee99421	brayancespedes57@gmail.com	5140	8	t	Hola mnindo					https://avatars.githubusercontent.com/u/126025038?v=4	2026-02-10 17:44:42.502568	github	126025038	https://avatars.githubusercontent.com/u/126025038?v=4	2026-03-20 15:05:01.56175	diamond
8c63e328-754f-41b3-96b2-febcc8db78f1	GraphicsGod	graphicsgod@test.com	1092	3	t	\N	graphicsgod	\N	\N	\N	\N	2025-10-06 08:57:49.569	\N	\N	\N	2026-02-10 17:40:27.431356	gold
7bbf08be-8791-4b49-9452-3200a0b22b87	HackerHunter_56	hackerhunter@test.com	510	2	t	Code is poetry 📝	hackerhunter	\N	\N	\N	\N	2025-03-15 08:57:49.597	\N	\N	\N	2026-02-10 17:40:27.431356	gold
f7b55a67-e41f-4c48-902c-0ea858cd13be	FirewallFixer_58	firewallfixer@test.com	1397	3	t	From zero to hero in programming	\N	\N	\N	\N	\N	2025-02-16 07:57:49.604	\N	\N	\N	2026-02-10 17:40:27.431356	diamond
48187149-2343-4ede-9d45-9ec29279dfd2	FullStackFury_60	fullstackfury@test.com	1190	3	t	\N	fullstackfury	\N	\N	\N	\N	2025-08-29 08:57:49.61	\N	\N	\N	2026-02-10 17:40:27.431356	gold
33d891e5-c4e9-4caa-bd27-f66e6cfb37a3	MiddlewareMage_63	middlewaremage@test.com	751	2	t	Building apps that matter	\N	\N	\N	\N	\N	2025-04-08 08:57:49.638	\N	\N	\N	2026-02-10 17:40:27.431356	diamond
3db48db7-c6d9-43cf-8be1-a94392b362db	test	test@test.com	95	1	t	\N	\N	\N	\N	\N	\N	2026-01-31 13:37:05.237844	\N	\N	\N	2026-02-10 17:40:27.431356	diamond
61afbefb-6923-459b-afa3-edb5dadf8189	user_d87d2494	cespedesbrayan393@gmail.com	0	1	t	\N	\N	\N	\N	\N	https://lh3.googleusercontent.com/a/ACg8ocIcG9HJzQQtGwze1QcmJN3qQHy4PUkmGPVhMYG-wKD8QdJsMA=s96-c	2026-02-17 15:19:12.122857	google	105841923859576426176	https://lh3.googleusercontent.com/a/ACg8ocIcG9HJzQQtGwze1QcmJN3qQHy4PUkmGPVhMYG-wKD8QdJsMA=s96-c	2026-02-17 15:19:12.122857	diamond
30378a2f-9ad0-4849-82ff-4c162480ee11	sys_admin	admin@codex.ai	0	1	t	\N	\N	\N	\N	\N	\N	2026-02-28 17:51:01.023018	email	\N	\N	2026-02-28 17:51:01.023018	gold
f3642b14-2e93-44f2-84fc-db0ed83b404f	DataWizard	datawizard@test.com	3776	8	t	Turned caffeine into code since 2020	datawizard	\N	\N	\N	\N	2025-11-28 07:57:49.37	\N	\N	\N	2026-02-10 17:40:27.431356	gold
d0deb68d-283f-465f-9c10-211a4742a34e	DevOpsNinja	devopsninja@test.com	1304	3	t	Building the future, one line at a time	devopsninja	\N	\N	\N	\N	2025-11-09 07:57:49.527	\N	\N	\N	2026-02-10 17:40:27.431356	diamond
\.


--
-- Data for Name: weekly_xp; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.weekly_xp (id, user_id, xp_earned, week_start, created_at) FROM stdin;
75c5af2c-e3b5-48ff-b5e2-cc42ca5ff317	fde32463-d342-4cc0-8e8c-1845ce2162b7	200	2026-03-16	2026-03-19 10:24:09.356108
4b76a341-9a35-4f1e-8055-ed9d9c740d6a	5086d4a7-519a-4496-9938-ee343f38861f	145	2026-03-16	2026-03-19 13:40:33.264256
\.


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 17, true);


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
-- Name: daily_activity PK_daily_activity; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.daily_activity
    ADD CONSTRAINT "PK_daily_activity" PRIMARY KEY (id);


--
-- Name: exercise_tests PK_exercise_tests; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercise_tests
    ADD CONSTRAINT "PK_exercise_tests" PRIMARY KEY (id);


--
-- Name: live_coding_sessions PK_live_coding_sessions; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.live_coding_sessions
    ADD CONSTRAINT "PK_live_coding_sessions" PRIMARY KEY (id);


--
-- Name: skill_node_dependencies PK_skill_node_dependencies; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skill_node_dependencies
    ADD CONSTRAINT "PK_skill_node_dependencies" PRIMARY KEY (id);


--
-- Name: skill_nodes PK_skill_nodes; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skill_nodes
    ADD CONSTRAINT "PK_skill_nodes" PRIMARY KEY (id);


--
-- Name: user_skill_progress PK_user_skill_progress; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_skill_progress
    ADD CONSTRAINT "PK_user_skill_progress" PRIMARY KEY (id);


--
-- Name: user_streaks PK_user_streaks; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_streaks
    ADD CONSTRAINT "PK_user_streaks" PRIMARY KEY (id);


--
-- Name: weekly_xp PK_weekly_xp; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weekly_xp
    ADD CONSTRAINT "PK_weekly_xp" PRIMARY KEY (id);


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
-- Name: daily_activity UQ_daily_activity_user_date; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.daily_activity
    ADD CONSTRAINT "UQ_daily_activity_user_date" UNIQUE (user_id, activity_date);


--
-- Name: users UQ_fe0bb3f6520ee0469504521e710; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE (username);


--
-- Name: skill_node_dependencies UQ_skill_node_deps; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skill_node_dependencies
    ADD CONSTRAINT "UQ_skill_node_deps" UNIQUE (node_id, depends_on_id);


--
-- Name: skill_nodes UQ_skill_nodes_slug; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skill_nodes
    ADD CONSTRAINT "UQ_skill_nodes_slug" UNIQUE (slug);


--
-- Name: user_skill_progress UQ_user_skill_progress; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_skill_progress
    ADD CONSTRAINT "UQ_user_skill_progress" UNIQUE (user_id, node_id);


--
-- Name: user_streaks UQ_user_streaks_user_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_streaks
    ADD CONSTRAINT "UQ_user_streaks_user_id" UNIQUE (user_id);


--
-- Name: weekly_xp UQ_weekly_xp_user_week; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weekly_xp
    ADD CONSTRAINT "UQ_weekly_xp_user_week" UNIQUE (user_id, week_start);


--
-- Name: IDX_daily_activity_user_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_daily_activity_user_date" ON public.daily_activity USING btree (user_id, activity_date DESC);


--
-- Name: IDX_user_skill_progress_user_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_user_skill_progress_user_status" ON public.user_skill_progress USING btree (user_id, status);


--
-- Name: IDX_user_streaks_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_user_streaks_user_id" ON public.user_streaks USING btree (user_id);


--
-- Name: IDX_weekly_xp_week; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_weekly_xp_week" ON public.weekly_xp USING btree (week_start, xp_earned DESC);


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
-- Name: live_coding_sessions FK_964e840a3e866659939552104d3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.live_coding_sessions
    ADD CONSTRAINT "FK_964e840a3e866659939552104d3" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


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
-- Name: daily_activity FK_daily_activity_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.daily_activity
    ADD CONSTRAINT "FK_daily_activity_user" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reactions FK_dde6062145a93649adc5af3946e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reactions
    ADD CONSTRAINT "FK_dde6062145a93649adc5af3946e" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: live_coding_sessions FK_e244b75ae49234835b3d677b3f5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.live_coding_sessions
    ADD CONSTRAINT "FK_e244b75ae49234835b3d677b3f5" FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE CASCADE;


--
-- Name: user_badges FK_f1221d9b1aaa64b1f3c98ed46d3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT "FK_f1221d9b1aaa64b1f3c98ed46d3" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: skill_node_dependencies FK_skill_node_deps_depends; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skill_node_dependencies
    ADD CONSTRAINT "FK_skill_node_deps_depends" FOREIGN KEY (depends_on_id) REFERENCES public.skill_nodes(id) ON DELETE CASCADE;


--
-- Name: skill_node_dependencies FK_skill_node_deps_node; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skill_node_dependencies
    ADD CONSTRAINT "FK_skill_node_deps_node" FOREIGN KEY (node_id) REFERENCES public.skill_nodes(id) ON DELETE CASCADE;


--
-- Name: user_skill_progress FK_user_skill_progress_node; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_skill_progress
    ADD CONSTRAINT "FK_user_skill_progress_node" FOREIGN KEY (node_id) REFERENCES public.skill_nodes(id) ON DELETE CASCADE;


--
-- Name: user_skill_progress FK_user_skill_progress_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_skill_progress
    ADD CONSTRAINT "FK_user_skill_progress_user" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_streaks FK_user_streaks_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_streaks
    ADD CONSTRAINT "FK_user_streaks_user" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: weekly_xp FK_weekly_xp_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weekly_xp
    ADD CONSTRAINT "FK_weekly_xp_user" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict AsCEanLtAVpFldVJPPXURr7fjFNCaKwUsgUx190QQlz0iplCnp38RKpzBfrkr4g

